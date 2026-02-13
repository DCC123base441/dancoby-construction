import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Card, CardContent } from "@/components/ui/card";

import { PiggyBank, TrendingUp, Sparkles, Trophy, SlidersHorizontal } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useLanguage } from './LanguageContext';
import moment from 'moment';
import confetti from 'canvas-confetti';

const QUARTERLY_GOAL = 3500000;

export default function QuarterlyShare() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();
  const currentQuarter = Math.floor(new Date().getMonth() / 3) + 1;
  const queryClient = useQueryClient();
  const [sliderValue, setSliderValue] = useState(null);
  const hasFiredConfetti = useRef(false);

  const fireConfetti = useCallback(() => {
    confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
    confetti({ particleCount: 80, spread: 100, origin: { y: 0.7 }, startVelocity: 25 });
    if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
    try { new Audio('https://cdn.freesound.org/previews/397/397354_4284968-lq.mp3').play(); } catch (e) {}
  }, []);

  const handleSliderChange = useCallback((val) => {
    setSliderValue(val[0]);
    if (val[0] === 100 && !hasFiredConfetti.current) {
      hasFiredConfetti.current = true;
      fireConfetti();
    }
    if (val[0] < 100) {
      hasFiredConfetti.current = false;
    }
  }, [fireConfetti]);

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
          {/* Current quarter — big highlight with slider */}
          <div className="bg-emerald-50 rounded-lg border border-emerald-100 p-4 text-center">
            <div className="flex items-center justify-center gap-1.5 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <p className="text-xs text-emerald-700 font-semibold uppercase tracking-wider">
                {sliderValue > 0
                  ? (t('potentialEarnings') || 'Potential Earnings')
                  : `Q${currentQuarter} ${currentYear} — ${t('inProgress') || 'In Progress'}`}
              </p>
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            </div>
            {(() => {
              const simulatedRevenue = ytdRevenue + (QUARTERLY_GOAL - ytdRevenue) * (sliderValue / 100);
              const simulatedPool = simulatedRevenue * (bonusPercent / 100);
              const simulatedPerPerson = headcount > 0 ? simulatedPool / headcount : 0;
              const currentAmount = inProgressShare ? inProgressShare.amount : 0;
              const displayAmount = sliderValue > 0 ? simulatedPerPerson : currentAmount;
              const diff = simulatedPerPerson - totalPerPerson;
              return (
                <>
                  <span className="text-4xl font-bold text-gray-900">
                    ${displayAmount.toFixed(2)}
                  </span>
                  {sliderValue > 0 && diff > 0 && (
                    <p className="text-xs text-emerald-600 font-semibold mt-1">
                      +${diff.toFixed(2)} {t('moreThanCurrent') || 'more than current'}
                    </p>
                  )}
                </>
              );
            })()}
            <p className="text-sm text-emerald-700 mt-1.5 font-medium">
              {sliderValue > 0
                ? `${t('basedOnBonusShare') || 'Based on'} ${bonusPercent}% ${t('bonusShare') || 'bonus share'}`
                : (t('earningsFromGrowth') || 'Earnings from growth')}
            </p>
            {totalPerPerson > 0 && sliderValue === 0 && (
              <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-emerald-600 bg-emerald-100/60 rounded-full py-1 px-3 w-fit mx-auto">
                <TrendingUp className="w-3 h-3" />
                <span>{t('growingStrong') || 'Growing strong this quarter!'}</span>
              </div>
            )}

            {/* Slider — starts at current YTD progress, drag to explore */}
            {(() => {
              const baseProgress = Math.min((ytdRevenue / QUARTERLY_GOAL) * 100, 100);
              const effectiveValue = sliderValue !== null ? sliderValue : baseProgress;
              return (
                <div className="mt-4 space-y-2">
                  <style>{`
                    .qs-slider {
                      -webkit-appearance: none;
                      appearance: none;
                      width: 100%;
                      height: 8px;
                      border-radius: 9999px;
                      outline: none;
                      background: linear-gradient(to right, #10b981 0%, #10b981 ${effectiveValue}%, #a7f3d0 ${effectiveValue}%, #a7f3d0 100%);
                    }
                    .qs-slider::-webkit-slider-thumb {
                      -webkit-appearance: none;
                      appearance: none;
                      width: 28px;
                      height: 28px;
                      border-radius: 50%;
                      background: white;
                      border: 2px solid #10b981;
                      box-shadow: 0 1px 4px rgba(0,0,0,0.15);
                      cursor: pointer;
                    }
                    .qs-slider::-moz-range-thumb {
                      width: 28px;
                      height: 28px;
                      border-radius: 50%;
                      background: white;
                      border: 2px solid #10b981;
                      box-shadow: 0 1px 4px rgba(0,0,0,0.15);
                      cursor: pointer;
                    }
                  `}</style>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={effectiveValue}
                    onChange={(e) => handleSliderChange([Number(e.target.value)])}
                    className="qs-slider"
                  />
                  <div className="flex justify-between text-[10px] text-emerald-600 font-medium">
                    <span>$0</span>
                    <span>${(ytdRevenue / 1000000).toFixed(2)}M ({baseProgress.toFixed(0)}%)</span>
                    <span>${(QUARTERLY_GOAL / 1000000).toFixed(1)}M 🎯</span>
                  </div>
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