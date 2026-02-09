import React, { useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gift, Info, CheckCircle2, Circle } from 'lucide-react';
import { useLanguage } from './LanguageContext';

// DEMO DATA — will be replaced with JobTread API
// 0.001% = 0.001 / 100 = 0.00001
const BONUS_RATE = 0.001 / 100; // 0.001%
const REVENUE_GOAL = 2_500_000;

function QuarterBar({ label, revenue, goal, bonus, isCurrent, t }) {
  const percent = Math.min((revenue / goal) * 100, 100);
  const hitGoal = revenue >= goal;

  return (
    <div className="flex items-center gap-3">
      <div className="w-8 text-sm font-semibold text-gray-700 shrink-0">
        {label}
        {isCurrent && <span className="block text-[10px] text-emerald-500 font-normal">{t('bonusNow')}</span>}
      </div>
      <div className="flex-1">
        <div className="w-full h-8 bg-gray-100 rounded-lg overflow-hidden relative">
          <div
            className={`h-full rounded-lg transition-all duration-700 ${hitGoal ? 'bg-emerald-500' : 'bg-emerald-300'}`}
            style={{ width: `${percent}%` }}
          />
          <div className="absolute inset-0 flex items-center px-3">
            <span className="text-xs font-semibold text-white drop-shadow-sm">
              ${(revenue / 1000).toFixed(0)}k
            </span>
          </div>
        </div>
      </div>
      <div className="w-16 text-right shrink-0">
        {hitGoal ? (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
            <CheckCircle2 className="w-3.5 h-3.5" /> {t('bonusHit')}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs text-gray-400">
            <Circle className="w-3.5 h-3.5" /> {t('bonusMiss')}
          </span>
        )}
      </div>
    </div>
  );
}

export default function BonusTracker() {
  const { t } = useLanguage();

  const { quarterlyData, totalRevenue, estimatedBonus, currentQuarter } = useMemo(() => {
    const now = new Date();
    const month = now.getMonth(); // 0-11
    const cq = Math.floor(month / 3) + 1; // 1-4

    // Demo revenue data per quarter — only show quarters up to current
    const allQuarters = [
      { label: t('bonusQ1'), revenue: 150000, quarter: 1 },
      { label: t('bonusQ2'), revenue: 560000, quarter: 2 },
      { label: t('bonusQ3'), revenue: 520000, quarter: 3 },
      { label: t('bonusQ4'), revenue: 440000, quarter: 4 },
    ];

    const quarters = allQuarters.filter(q => q.quarter <= cq);
    const total = quarters.reduce((sum, q) => sum + q.revenue, 0);
    const bonus = total * BONUS_RATE;
    const quarterlyGoal = REVENUE_GOAL / 4;

    const data = quarters.map(q => ({
      ...q,
      goal: quarterlyGoal,
      isCurrent: q.quarter === cq,
      bonus: parseFloat((q.revenue * BONUS_RATE).toFixed(2)),
    }));

    return { quarterlyData: data, totalRevenue: total, estimatedBonus: bonus, currentQuarter: cq };
  }, [t]);

  const progressPercent = Math.min((totalRevenue / REVENUE_GOAL) * 100, 100);

  return (
    <Card className="border-gray-200">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-emerald-50">
              <Gift className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="font-bold text-gray-900">{t('bonusTracker')}</h3>
          </div>
          <Badge className="bg-amber-100 text-amber-800 text-xs">Demo</Badge>
        </div>
        <p className="text-sm text-gray-500 mb-5">{t('bonusSimpleExplain')} ({t('bonusAsOf')} Q{currentQuarter} {new Date().getFullYear()})</p>

        {/* Big Bonus Number */}
        <div className="text-center p-5 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-200 mb-5">
          <p className="text-xs uppercase tracking-wider text-emerald-600 font-medium mb-1">{t('estimatedBonus')}</p>
          <p className="text-4xl font-bold text-emerald-700">${estimatedBonus.toFixed(2)}</p>
          <p className="text-sm text-emerald-600 mt-1">{t('bonusCalcExplain')}</p>
        </div>

        {/* Simple Breakdown */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
            <p className="text-xs text-gray-500 mb-1">{t('bonusTotalMade')}</p>
            <p className="text-xl font-bold text-gray-900">${(totalRevenue / 1_000_000).toFixed(1)}M</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
            <p className="text-xs text-gray-500 mb-1">{t('bonusGoalLabel')}</p>
            <p className="text-xl font-bold text-gray-900">${(REVENUE_GOAL / 1_000_000).toFixed(1)}M</p>
          </div>
        </div>

        {/* Progress toward goal */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-700">{t('bonusProgressLabel')}</p>
            <p className="text-sm font-bold text-emerald-600">{progressPercent.toFixed(0)}%</p>
          </div>
          <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>$0</span>
            <span>${(REVENUE_GOAL / 1_000_000).toFixed(1)}M {t('bonusGoalLabel')}</span>
          </div>
        </div>

        {/* Quarterly Bars — simple horizontal */}
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-3">{t('bonusQuarterlyBreakdown')}</p>
          <div className="space-y-3">
            {quarterlyData.map((q, i) => (
              <QuarterBar key={i} label={q.label} revenue={q.revenue} goal={q.goal} bonus={q.bonus} isCurrent={q.isCurrent} t={t} />
            ))}
          </div>
          <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm bg-emerald-500" /> {t('bonusAboveGoal')}
            </span>
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm bg-emerald-300" /> {t('bonusBelowGoal')}
            </span>
            <span>| {t('bonusGoalLine')}: ${((REVENUE_GOAL / 4) / 1000).toFixed(0)}k</span>
          </div>
        </div>

        {/* Info Note */}
        <div className="p-3 rounded-lg bg-blue-50 border border-blue-100 flex items-start gap-2">
          <Info className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
          <p className="text-xs text-blue-700">{t('bonusNote')}</p>
        </div>
      </CardContent>
    </Card>
  );
}