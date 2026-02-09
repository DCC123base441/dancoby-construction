import React, { useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gift, TrendingUp, DollarSign, Info } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';

// DEMO DATA — will be replaced with JobTread API
const DEMO_ANNUAL_REVENUE = 2_000_000;
const BONUS_RATE = 0.00001; // 0.001%
const REVENUE_GOAL = 2_500_000;

export default function BonusTracker() {
  const { t } = useLanguage();

  const { quarterlyData, totalRevenue, estimatedBonus } = useMemo(() => {
    // Demo quarterly breakdown (simulated)
    const quarters = [
      { name: 'Q1', revenue: 480000 },
      { name: 'Q2', revenue: 560000 },
      { name: 'Q3', revenue: 520000 },
      { name: 'Q4', revenue: 440000 },
    ];

    const total = quarters.reduce((sum, q) => sum + q.revenue, 0);
    const bonus = total * BONUS_RATE;

    const quarterlyGoal = REVENUE_GOAL / 4;
    const data = quarters.map(q => ({
      ...q,
      goal: quarterlyGoal,
      bonus: parseFloat((q.revenue * BONUS_RATE).toFixed(2)),
      aboveGoal: q.revenue >= quarterlyGoal,
    }));

    return { quarterlyData: data, totalRevenue: total, estimatedBonus: bonus };
  }, []);

  const progressPercent = Math.min((totalRevenue / REVENUE_GOAL) * 100, 100);

  return (
    <Card className="border-gray-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-emerald-50">
              <Gift className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">{t('bonusTracker')}</h3>
              <p className="text-xs text-gray-500">{t('bonusTrackerDesc')}</p>
            </div>
          </div>
          <Badge className="bg-amber-100 text-amber-800 text-xs">Demo</Badge>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="p-3 rounded-lg bg-slate-50 text-center">
            <p className="text-xs text-gray-500">{t('companyRevenue')}</p>
            <p className="text-lg font-bold text-gray-900">${(totalRevenue / 1_000_000).toFixed(1)}M</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 text-center">
            <p className="text-xs text-gray-500">{t('yourBonusRate')}</p>
            <p className="text-lg font-bold text-gray-900">0.001%</p>
          </div>
          <div className="p-3 rounded-lg bg-emerald-50 text-center">
            <p className="text-xs text-emerald-600">{t('estimatedBonus')}</p>
            <p className="text-lg font-bold text-emerald-700">${estimatedBonus.toFixed(2)}</p>
          </div>
        </div>

        {/* Revenue Goal Progress */}
        <div className="mb-5">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>{t('revenueGoal')}</span>
            <span>${(totalRevenue / 1_000_000).toFixed(2)}M / ${(REVENUE_GOAL / 1_000_000).toFixed(1)}M</span>
          </div>
          <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1 text-right">{progressPercent.toFixed(0)}%</p>
        </div>

        {/* Quarterly Bar Chart */}
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={quarterlyData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} />
              <YAxis
                tick={{ fontSize: 11, fill: '#6b7280' }}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(value) => [`$${value.toLocaleString()}`, t('quarterly') + ' ' + t('companyRevenue')]}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }}
              />
              <ReferenceLine
                y={REVENUE_GOAL / 4}
                stroke="#f59e0b"
                strokeDasharray="4 4"
                label={{ value: t('revenueGoal'), position: 'right', fontSize: 10, fill: '#f59e0b' }}
              />
              <Bar dataKey="revenue" radius={[6, 6, 0, 0]} maxBarSize={45}>
                {quarterlyData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={entry.aboveGoal ? '#10b981' : '#6ee7b7'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-3 p-3 rounded-lg bg-blue-50 border border-blue-100 flex items-start gap-2">
          <Info className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
          <p className="text-xs text-blue-700">{t('bonusNote')}</p>
        </div>
      </CardContent>
    </Card>
  );
}