import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HardHat, UserCircle, CalendarDays, DollarSign, MessageSquare, BookOpen, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from './LanguageContext';

const STEPS = [
  {
    id: 'welcome',
    icon: Sparkles,
    color: 'text-amber-500',
    bg: 'bg-amber-50',
  },
  {
    id: 'resources',
    icon: BookOpen,
    color: 'text-blue-500',
    bg: 'bg-blue-50',
  },
  {
    id: 'profile',
    icon: UserCircle,
    color: 'text-green-500',
    bg: 'bg-green-50',
  },
];

const RESOURCE_ITEMS = [
  { icon: DollarSign, labelKey: 'tabSalary', descKey: 'onboardSalaryDesc', color: 'text-green-600', bg: 'bg-green-50' },
  { icon: CalendarDays, labelKey: 'tabHolidays', descKey: 'onboardHolidaysDesc', color: 'text-blue-600', bg: 'bg-blue-50' },
  { icon: MessageSquare, labelKey: 'tabFeedback', descKey: 'onboardFeedbackDesc', color: 'text-purple-600', bg: 'bg-purple-50' },
  { icon: ShieldCheck, labelKey: 'tabTimeOff', descKey: 'onboardTimeOffDesc', color: 'text-orange-600', bg: 'bg-orange-50' },
];

export default function OnboardingWelcome({ firstName, onComplete, onSetupProfile }) {
  const [step, setStep] = useState(0);
  const { t } = useLanguage();

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      onSetupProfile();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.97 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-lg"
        >
          <Card className="border-0 shadow-2xl overflow-hidden">
            {/* Progress dots */}
            <div className="flex justify-center gap-2 pt-5">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === step ? 'w-8 bg-amber-500' : i < step ? 'w-4 bg-amber-300' : 'w-4 bg-gray-200'
                  }`}
                />
              ))}
            </div>

            <CardContent className="p-6 sm:p-8">
              {step === 0 && (
                <div className="text-center space-y-5">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto shadow-lg">
                    <HardHat className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {t('onboardWelcomeTitle')}, {firstName}! 🎉
                    </h2>
                    <p className="text-gray-500 mt-2 text-sm leading-relaxed">
                      {t('onboardWelcomeDesc')}
                    </p>
                  </div>
                  <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-left">
                    <p className="text-sm font-medium text-amber-800">{t('onboardQuickStart')}</p>
                    <ul className="mt-2 space-y-1.5 text-sm text-amber-700">
                      <li className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center text-xs font-bold">1</span>
                        {t('onboardStep1')}
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center text-xs font-bold">2</span>
                        {t('onboardStep2')}
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center text-xs font-bold">3</span>
                        {t('onboardStep3')}
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-5">
                  <div className="text-center">
                    <h2 className="text-xl font-bold text-gray-900">{t('onboardResourcesTitle')}</h2>
                    <p className="text-gray-500 text-sm mt-1">{t('onboardResourcesDesc')}</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {RESOURCE_ITEMS.map((item) => (
                      <div key={item.labelKey} className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50/50">
                        <div className={`p-2 rounded-lg ${item.bg} flex-shrink-0`}>
                          <item.icon className={`w-4 h-4 ${item.color}`} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{t(item.labelKey)}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{t(item.descKey)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="text-center space-y-5">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mx-auto shadow-lg">
                    <UserCircle className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{t('onboardProfileTitle')}</h2>
                    <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                      {t('onboardProfileDesc')}
                    </p>
                  </div>
                  <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-sm text-green-800">
                    {t('onboardProfileHint')}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                <Button variant="ghost" size="sm" onClick={handleSkip} className="text-gray-400 hover:text-gray-600">
                  {t('onboardSkip')}
                </Button>
                <Button onClick={handleNext} className="bg-amber-600 hover:bg-amber-700 gap-2">
                  {step === STEPS.length - 1 ? t('onboardSetupProfile') : t('onboardNext')}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}