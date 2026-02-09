import React, { useState, useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, TrendingUp, Award, BookOpen, ShieldCheck, Star, Target, Zap, Users } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

function SalaryGrowthChart({ hourly, startDate }) {
  const [showYoY, setShowYoY] = useState(false);

  const chartData = useMemo(() => {
    if (!hourly) return [];
    
    const startYear = startDate ? new Date(startDate).getFullYear() : new Date().getFullYear() - 3;
    const currentYear = new Date().getFullYear();
    const yearsWorked = Math.max(currentYear - startYear, 1);

    // Simulate salary growth history (assuming ~3-5% annual raises)
    const data = [];
    const growthRates = [0, 0.03, 0.04, 0.05, 0.035, 0.045, 0.04, 0.05, 0.03, 0.04];
    
    let currentRate = hourly;
    const yearlyRates = [];
    
    for (let i = 0; i <= yearsWorked; i++) {
      yearlyRates.push(currentRate);
    }
    
    // Work backwards from current rate
    for (let i = yearsWorked - 1; i >= 0; i--) {
      const growth = growthRates[i % growthRates.length] || 0.04;
      yearlyRates[i] = yearlyRates[i + 1] / (1 + growth);
    }

    for (let i = 0; i <= yearsWorked; i++) {
      const year = startYear + i;
      const rate = yearlyRates[i];
      const annualSalary = rate * 40 * 52;
      const prevRate = i > 0 ? yearlyRates[i - 1] : rate;
      const yoyGrowth = i > 0 ? ((rate - prevRate) / prevRate * 100) : 0;

      data.push({
        year: year.toString(),
        hourlyRate: parseFloat(rate.toFixed(2)),
        annualSalary: Math.round(annualSalary),
        yoyGrowth: parseFloat(yoyGrowth.toFixed(1)),
        isCurrent: year === currentYear,
      });
    }

    return data;
  }, [hourly, startDate]);

  if (!hourly || chartData.length === 0) {
    return (
      <Card className="border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-full bg-blue-50">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-bold text-gray-900">Salary Growth</h3>
          </div>
          <p className="text-sm text-gray-400">Your salary growth chart will appear once your hourly rate is set by management.</p>
        </CardContent>
      </Card>
    );
  }

  const formatDollar = (value) => `$${value.toLocaleString()}`;
  const dataKey = showYoY ? 'yoyGrowth' : 'annualSalary';
  const barColor = showYoY ? '#f59e0b' : '#22c55e';

  return (
    <Card className="border-gray-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-blue-50">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-bold text-gray-900">Salary Growth</h3>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="yoy-toggle" className="text-xs text-gray-500 cursor-pointer">
              {showYoY ? '% Growth' : 'Annual Pay'}
            </Label>
            <Switch id="yoy-toggle" checked={showYoY} onCheckedChange={setShowYoY} />
          </div>
        </div>

        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#6b7280' }} />
              <YAxis 
                tick={{ fontSize: 11, fill: '#6b7280' }} 
                tickFormatter={showYoY ? (v) => `${v}%` : (v) => `$${(v / 1000).toFixed(0)}k`} 
              />
              <Tooltip 
                formatter={(value) => showYoY ? [`${value}%`, 'Year-over-Year Growth'] : [formatDollar(value), 'Annual Salary']}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }}
              />
              <Bar dataKey={dataKey} radius={[6, 6, 0, 0]} maxBarSize={40}>
                {chartData.map((entry, index) => (
                  <Cell 
                    key={index} 
                    fill={entry.isCurrent ? (showYoY ? '#d97706' : '#16a34a') : barColor} 
                    opacity={entry.isCurrent ? 1 : 0.6} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {chartData.length > 1 && (
          <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: barColor, opacity: 0.6 }} />
              Past Years
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: showYoY ? '#d97706' : '#16a34a' }} />
              Current Year
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function MotivationalSection() {
  const milestones = [
    { icon: Target, title: 'Hit Your Goals', desc: 'Complete assigned projects on time and within budget to earn performance bonuses.', color: 'bg-blue-50 text-blue-600' },
    { icon: Zap, title: 'Go Above & Beyond', desc: 'Taking initiative on extra tasks and helping teammates gets noticed by management.', color: 'bg-amber-50 text-amber-600' },
    { icon: Star, title: 'Build Your Reputation', desc: 'Consistent quality work leads to promotions, better projects, and higher pay.', color: 'bg-purple-50 text-purple-600' },
    { icon: Users, title: 'Mentor Others', desc: 'Training new team members shows leadership and qualifies you for foreman roles.', color: 'bg-green-50 text-green-600' },
  ];

  return (
    <Card className="border-gray-200 bg-gradient-to-br from-gray-50 to-white">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 rounded-full bg-amber-50">
            <Star className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Your Path to Success</h3>
            <p className="text-xs text-gray-500">What top earners do differently</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {milestones.map((item, i) => (
            <div key={i} className="flex gap-3 p-3 rounded-lg bg-white border border-gray-100 hover:shadow-sm transition-shadow">
              <div className={`p-2 rounded-lg ${item.color} h-fit`}>
                <item.icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 p-4 rounded-lg bg-amber-50 border border-amber-100">
          <p className="text-sm font-medium text-amber-800 flex items-center gap-2">
            <Zap className="w-4 h-4" /> Did you know?
          </p>
          <p className="text-xs text-amber-700 mt-1">
            Employees who complete certifications and take on leadership roles earn on average <strong>25-40% more</strong> within 3 years. Your growth is in your hands!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function SalarySection({ profile }) {
  const hourly = profile?.hourlySalary;
  const { t } = useLanguage();

  const RECOMMENDATIONS = [
    { icon: ShieldCheck, title: t('osha'), desc: t('oshaDesc') },
    { icon: Award, title: t('leadProject'), desc: t('leadProjectDesc') },
    { icon: BookOpen, title: t('learnSkill'), desc: t('learnSkillDesc') },
    { icon: TrendingUp, title: t('attendance'), desc: t('attendanceDesc') },
  ];

  return (
    <div className="space-y-4">
      <Card className="border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-full bg-green-50">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-bold text-gray-900">{t('yourCompensation')}</h3>
          </div>
          {hourly ? (
            <div className="flex items-end gap-1 mb-1">
              <span className="text-4xl font-bold text-gray-900">${hourly.toFixed(2)}</span>
              <span className="text-gray-500 text-sm mb-1">{t('perHour')}</span>
            </div>
          ) : (
            <p className="text-gray-400 text-sm">{t('rateNotSet')}</p>
          )}
          {hourly && (
            <p className="text-xs text-gray-400 mt-1">
              ≈ ${(hourly * 40).toFixed(0)}/week · ${(hourly * 40 * 52).toLocaleString()}/year (40 hrs/wk)
            </p>
          )}
        </CardContent>
      </Card>

      <SalaryGrowthChart hourly={hourly} startDate={profile?.startDate} />

      <MotivationalSection />

      <Card className="border-gray-200">
        <CardContent className="p-6">
          <h4 className="font-semibold text-gray-900 mb-4">{t('waysToIncrease')}</h4>
          <div className="space-y-4">
            {RECOMMENDATIONS.map((rec, i) => (
              <div key={i} className="flex gap-3">
                <div className="p-2 rounded-lg bg-gray-50 h-fit">
                  <rec.icon className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{rec.title}</p>
                  <p className="text-xs text-gray-500">{rec.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}