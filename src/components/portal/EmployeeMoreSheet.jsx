import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { UserCircle, CalendarOff, HandCoins, ShoppingBag, MonitorPlay, Bell, Newspaper, DollarSign, CalendarDays, MessageCircle } from 'lucide-react';
import { useLanguage } from './LanguageContext';

const ITEM_META = {
  salary: { icon: DollarSign, labelKey: 'tabSalary', color: 'bg-emerald-100 text-emerald-600' },
  holidays: { icon: CalendarDays, labelKey: 'tabHolidays', color: 'bg-red-100 text-red-600' },
  feedback: { icon: MessageCircle, labelKey: 'tabFeedback', color: 'bg-purple-100 text-purple-600' },
  timeoff: { icon: CalendarOff, labelKey: 'tabTimeOff', color: 'bg-orange-100 text-orange-600' },
  raise: { icon: HandCoins, labelKey: 'tabRaise', color: 'bg-amber-100 text-amber-600' },
  gear: { icon: ShoppingBag, labelKey: 'tabGear', color: 'bg-pink-100 text-pink-600' },
  profile: { icon: UserCircle, labelKey: 'tabProfile', color: 'bg-slate-100 text-slate-600' },
  news: { icon: Newspaper, labelKey: 'tabNews', color: 'bg-indigo-100 text-indigo-600' },
  jobtread: { icon: MonitorPlay, labelKey: 'tabJobTread', color: 'bg-cyan-100 text-cyan-600' },
  notifications: { icon: Bell, labelKey: 'notifications', color: 'bg-blue-100 text-blue-600' },
};

const DEFAULT_MORE = ['salary', 'holidays', 'feedback', 'timeoff', 'raise', 'gear'];

export default function EmployeeMoreSheet({ open, onOpenChange, onTabChange, navConfig }) {
  const { t } = useLanguage();

  const moreIds = navConfig?.moreSheetOrder?.length ? navConfig.moreSheetOrder : DEFAULT_MORE;
  const moreItems = moreIds.map(id => ({ id, ...ITEM_META[id] })).filter(item => item.icon);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl pb-8">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-base">{t('more') || 'More'}</SheetTitle>
        </SheetHeader>
        <div className="grid grid-cols-2 gap-3">
          {moreItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onTabChange(item.id);
                onOpenChange(false);
              }}
              className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors text-left"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color}`}>
                <item.icon className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-gray-800">
                {t(item.labelKey) || item.labelKey}
              </span>
            </button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}