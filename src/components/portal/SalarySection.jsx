import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, TrendingUp, Award, BookOpen, ShieldCheck } from 'lucide-react';
import { useLanguage } from './LanguageContext';

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