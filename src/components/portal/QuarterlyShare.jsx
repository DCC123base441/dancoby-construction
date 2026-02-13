import React, { useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { PiggyBank, TrendingUp, Sparkles, Trophy } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useLanguage } from './LanguageContext';
import moment from 'moment';

export default function QuarterlyShare() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();
  const currentQuarter = Math.floor(new Date().getMonth() / 3) + 1;
  const queryClient = useQueryClient();

  useEffect(() => {
    const unsub1 = base44.entities.CompanyGoal.subscribe(() => {
      queryClient.invalidateQueries({ queryKey: ['companyGoal'] });
    });
    const unsub2 = base44.entities.EmployeeProfile.subscribe(() => {
      queryClient.invalidateQueries({ queryKey: ['activeEmployees'] });
    });
    return () => { unsub1(); unsub2(); };
  }, [queryClient]);

  const { data: goalData, isLoading: goalLoading } = useQuery({
    queryKey: ['companyGoal', currentYear],
    queryFn: async () => {
      const results = await base44.entities.CompanyGoal.filter({ year: currentYear });
      return results[0] || null;
    }
  });

  const { data: employees, isLoading: empLoading } = useQuery({
    queryKey: ['activeEmployees'],
    queryFn: async () => {
      const profiles = await base44.entities.EmployeeProfile.filter({ status: 'active' });
      return profiles;
    }
  });

  const isLoading = goalLoading || empLoading;

  if (isLoading) {
    return <div className="h-28 rounded-xl bg-gray-50 animate-pulse" />;
  }

  if (!goalData || !employees || employees.length === 0) return null;

  const headcount = goalData.headcountOverride || employees.length;
  const bonusPercent = goalData.bonusSharePercent ?? 4;

  // Get revenue for completed quarters only
  const breakdown = goalData.quarterlyBreakdown || {};
  const quarterKeys = ['q1', 'q2', 'q3', 'q4'];
  
  // Calculate per-quarter shares
  const quarterShares = [];
  let ytdRevenue = 0;

  for (let q = 0; q < currentQuarter; q++) {
    const qRevenue = breakdown[quarterKeys[q]] || 0;
    ytdRevenue += qRevenue;
    const poolForQuarter = qRevenue * (bonusPercent / 100);
    const perPerson = headcount > 0 ? poolForQuarter / headcount : 0;
    quarterShares.push({
      quarter: q + 1,
      amount: perPerson,
    });
  }

  // Total YTD share for this employee
  const totalPool = ytdRevenue * (bonusPercent / 100);
  const totalPerPerson = headcount > 0 ? totalPool / headcount : 0;

  // Latest completed quarter share (current quarter is in-progress)
  const latestCompleted = currentQuarter > 1 ? quarterShares[currentQuarter - 2] : null;
  const inProgressShare = quarterShares[currentQuarter - 1];

  const growthMessage = totalPerPerson > 0 
    ? (t('keepItUp') || "You're growing with the company — keep up the great work! 💪")
    : (t('stayTuned') || "Revenue is building — your share is on its way!");

  return (
    <Card className="border-0 overflow-hidden shadow-lg ring-1 ring-emerald-100">
      <CardContent className="p-0">
        {/* Hero banner */}
        <div className="relative bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 p-5 pb-6 text-white overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10" />
          <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-white/10" />
          
          <div className="relative flex items-center gap-3 mb-1">
            <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-sm">
              <PiggyBank className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base">{t('quarterlyShare') || 'Quarterly Share'}</h3>
              <p className="text-emerald-100 text-xs">{t('quarterlyShareDesc') || 'Your share of company growth'}</p>
            </div>
          </div>
        </div>

        <div className="p-5 space-y-4">
          {/* Current quarter — big highlight */}
          <div className="relative bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200/60 p-5 text-center">
            <div className="flex items-center justify-center gap-1.5 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <p className="text-xs text-emerald-700 font-semibold uppercase tracking-wider">
                Q{currentQuarter} {currentYear} — {t('inProgress') || 'In Progress'}
              </p>
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-4xl font-extrabold text-gray-900">
                ${inProgressShare ? inProgressShare.amount.toFixed(2) : '0.00'}
              </span>
            </div>
            <p className="text-sm text-emerald-700 mt-1.5 font-medium">{t('earningsFromGrowth') || 'Earnings from growth'}</p>
            {totalPerPerson > 0 && (
              <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-emerald-600 bg-emerald-100/60 rounded-full py-1 px-3 w-fit mx-auto">
                <TrendingUp className="w-3 h-3" />
                <span>{t('growingStrong') || 'Growing strong this quarter!'}</span>
              </div>
            )}
          </div>

          {/* Motivational message */}
          <div className="bg-amber-50 border border-amber-200/60 rounded-xl px-4 py-3 text-center">
            <p className="text-sm text-amber-800 font-medium">{growthMessage}</p>
          </div>

          {/* Past quarters */}
          {quarterShares.filter(q => q.quarter < currentQuarter).length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('pastQuarters') || 'Past Quarters'}</p>
              {quarterShares.filter(q => q.quarter < currentQuarter).map(q => (
                <div key={q.quarter} className="flex items-center justify-between py-2.5 px-3.5 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-sm font-medium text-gray-700">Q{q.quarter} {currentYear}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">${q.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}

          {/* YTD Total */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl p-4 flex items-center justify-between text-white">
            <span className="text-sm font-semibold">{t('ytdTotal') || 'Year-to-date total'}</span>
            <span className="text-xl font-extrabold">${totalPerPerson.toFixed(2)}</span>
          </div>
        </div>

        {/* Last updated */}
        {goalData.lastUpdated && (
          <div className="px-5 py-2.5 bg-gray-50 border-t border-gray-100">
            <p className="text-[11px] text-gray-400">
              {t('updated') || 'Updated'} {moment(goalData.lastUpdated).fromNow()} · {t('paidViaPayroll') || 'Paid via payroll'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}