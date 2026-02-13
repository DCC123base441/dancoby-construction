import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { PiggyBank, TrendingUp, Sparkles, Trophy, SlidersHorizontal } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useLanguage } from './LanguageContext';
import moment from 'moment';

const QUARTERLY_GOAL = 3500000;

export default function QuarterlyShare() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();
  const currentQuarter = Math.floor(new Date().getMonth() / 3) + 1;
  const queryClient = useQueryClient();
  const [sliderValue, setSliderValue] = useState(0);

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
    <Card className="border-gray-200">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-full bg-emerald-50">
            <PiggyBank className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">{t('quarterlyShare') || 'Quarterly Share'}</h3>
            <p className="text-xs text-gray-500">{t('quarterlyShareDesc') || 'Your share of company growth'}</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Current quarter — big highlight */}
          <div className="bg-emerald-50 rounded-lg border border-emerald-100 p-4 text-center">
            <div className="flex items-center justify-center gap-1.5 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <p className="text-xs text-emerald-700 font-semibold uppercase tracking-wider">
                Q{currentQuarter} {currentYear} — {t('inProgress') || 'In Progress'}
              </p>
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <span className="text-4xl font-bold text-gray-900">
              ${inProgressShare ? inProgressShare.amount.toFixed(2) : '0.00'}
            </span>
            <p className="text-sm text-emerald-700 mt-1.5 font-medium">{t('earningsFromGrowth') || 'Earnings from growth'}</p>
            {totalPerPerson > 0 && (
              <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-emerald-600 bg-emerald-100/60 rounded-full py-1 px-3 w-fit mx-auto">
                <TrendingUp className="w-3 h-3" />
                <span>{t('growingStrong') || 'Growing strong this quarter!'}</span>
              </div>
            )}
          </div>

          {/* Potential Earnings Slider */}
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
              <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
                {t('potentialEarnings') || 'Potential Earnings'}
              </p>
            </div>
            <p className="text-xs text-blue-600/80">
              {t('slideToSeeEarnings') || 'Slide to see what you could earn as the company grows'}
            </p>
            <Slider
              value={[sliderValue]}
              onValueChange={(val) => setSliderValue(val[0])}
              min={0}
              max={100}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-blue-500 font-medium">
              <span>{t('today') || 'Today'}</span>
              <span>2026 {t('goal') || 'Goal'} 🎯</span>
            </div>
            {(() => {
              const simulatedRevenue = ytdRevenue + (QUARTERLY_GOAL - ytdRevenue) * (sliderValue / 100);
              const simulatedPool = simulatedRevenue * (bonusPercent / 100);
              const simulatedPerPerson = headcount > 0 ? simulatedPool / headcount : 0;
              const diff = simulatedPerPerson - totalPerPerson;
              return (
                <div className="bg-white rounded-lg p-3 text-center border border-blue-100">
                  <p className="text-2xl font-bold text-blue-700">
                    ${simulatedPerPerson.toFixed(2)}
                  </p>
                  {diff > 0 && (
                    <p className="text-xs text-emerald-600 font-semibold mt-0.5">
                      +${diff.toFixed(2)} {t('moreThanCurrent') || 'more than current'}
                    </p>
                  )}
                  <p className="text-[10px] text-blue-500 mt-1">
                    {t('basedOnBonusShare') || 'Based on'} {bonusPercent}% {t('bonusShare') || 'bonus share'}
                  </p>
                </div>
              );
            })()}
          </div>

          {/* Motivational message */}
          <div className="bg-amber-50 border border-amber-100 rounded-lg px-4 py-3 text-center">
            <p className="text-sm text-amber-800 font-medium">{growthMessage}</p>
          </div>

          {/* Past quarters */}
          {quarterShares.filter(q => q.quarter < currentQuarter).length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('pastQuarters') || 'Past Quarters'}</p>
              {quarterShares.filter(q => q.quarter < currentQuarter).map(q => (
                <div key={q.quarter} className="flex items-center justify-between py-2.5 px-3.5 rounded-lg bg-gray-50 border border-gray-100">
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
          <div className="bg-emerald-600 rounded-lg p-4 flex items-center justify-between text-white">
            <span className="text-sm font-semibold">{t('ytdTotal') || 'Year-to-date total'}</span>
            <span className="text-xl font-bold">${totalPerPerson.toFixed(2)}</span>
          </div>

          {/* Last updated */}
          {goalData.lastUpdated && (
            <p className="text-[11px] text-gray-400">
              {t('updated') || 'Updated'} {moment(goalData.lastUpdated).fromNow()} · {t('paidViaPayroll') || 'Paid via payroll'}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}