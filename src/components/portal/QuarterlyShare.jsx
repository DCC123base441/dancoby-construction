import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { PiggyBank } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useLanguage } from './LanguageContext';
import moment from 'moment';

export default function QuarterlyShare() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();
  const currentQuarter = Math.floor(new Date().getMonth() / 3) + 1;

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

  return (
    <Card className="border-gray-200 overflow-hidden">
      <CardContent className="p-0">
        {/* Main display — clean, no formulas */}
        <div className="p-5 bg-gradient-to-br from-emerald-50 via-white to-emerald-50/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-full bg-emerald-100">
              <PiggyBank className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Quarterly Share</h3>
              <p className="text-xs text-gray-500">Your share of company growth</p>
            </div>
          </div>

          {/* Current quarter in-progress */}
          <div className="bg-white rounded-xl border border-emerald-200 p-4 mb-3">
            <p className="text-xs text-emerald-600 font-medium uppercase tracking-wider mb-1">
              Q{currentQuarter} {currentYear} — In Progress
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-900">
                ${inProgressShare ? inProgressShare.amount.toFixed(2) : '0.00'}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">Earnings from growth</p>
          </div>

          {/* Past quarters this year */}
          {quarterShares.filter(q => q.quarter < currentQuarter).length > 0 && (
            <div className="space-y-2">
              {quarterShares.filter(q => q.quarter < currentQuarter).map(q => (
                <div key={q.quarter} className="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-50">
                  <span className="text-sm text-gray-600">Q{q.quarter} {currentYear}</span>
                  <span className="text-sm font-semibold text-gray-900">
                    Earnings from growth: ${q.amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* YTD Total */}
          <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Year-to-date total</span>
            <span className="text-lg font-bold text-emerald-700">${totalPerPerson.toFixed(2)}</span>
          </div>
        </div>

        {/* Last updated */}
        {goalData.lastUpdated && (
          <div className="px-5 py-2 bg-gray-50 border-t border-gray-100">
            <p className="text-[11px] text-gray-400">
              Updated {moment(goalData.lastUpdated).fromNow()} · Paid via payroll
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}