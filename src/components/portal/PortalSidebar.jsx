import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { UserCircle, MessageCircle, DollarSign, CalendarDays, CalendarOff, HandCoins, ShoppingBag, MonitorPlay, Newspaper } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

const ALL_TABS = [
  { id: 'news', icon: Newspaper, labelKey: 'tabNews', color: 'text-indigo-600 bg-indigo-50' },
  { id: 'salary', icon: DollarSign, labelKey: 'tabSalary', color: 'text-emerald-600 bg-emerald-50' },
  { id: 'feedback', icon: MessageCircle, labelKey: 'tabFeedback', color: 'text-purple-600 bg-purple-50' },
  { id: 'holidays', icon: CalendarDays, labelKey: 'tabHolidays', color: 'text-red-600 bg-red-50' },
  { id: 'timeoff', icon: CalendarOff, labelKey: 'tabTimeOff', color: 'text-orange-600 bg-orange-50' },
  { id: 'raise', icon: HandCoins, labelKey: 'tabRaise', color: 'text-amber-600 bg-amber-50' },
  { id: 'gear', icon: ShoppingBag, labelKey: 'tabGear', color: 'text-pink-600 bg-pink-50' },
  { id: 'jobtread', icon: MonitorPlay, labelKey: 'tabJobTread', color: 'text-cyan-600 bg-cyan-50' },
  { id: 'profile', icon: UserCircle, labelKey: 'tabProfile', color: 'text-blue-600 bg-blue-50' },
];

export default function PortalSidebar({ activeTab, onTabChange }) {
  const { t } = useLanguage();

  const { data: notifications = [] } = useQuery({
    queryKey: ['myNotifications'],
    queryFn: async () => {
      const user = await base44.auth.me();
      return base44.entities.Notification.filter({ userEmail: user.email, read: false }, '-created_date', 100);
    },
    staleTime: 1000 * 30,
  });

  const counts = {
    news: notifications.filter(n => n.type === 'news').length,
    timeoff: notifications.filter(n => n.type === 'time_off').length,
    raise: notifications.filter(n => n.type === 'raise').length,
    feedback: notifications.filter(n => n.type === 'general' && n.title.includes('Feedback')).length, // rudimentary check
  };

  return (
    <aside className="hidden lg:flex flex-col w-56 flex-shrink-0 border-r border-gray-200 bg-white">
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {ALL_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-amber-50 text-amber-800 shadow-sm border border-amber-200'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                isActive ? 'bg-amber-100' : tab.color.split(' ')[1]
              }`}>
                <tab.icon className={`w-4 h-4 ${isActive ? 'text-amber-700' : tab.color.split(' ')[0]}`} />
              </div>
              <span>{t(tab.labelKey) || tab.labelKey}</span>
            </button>
          );
        })}
      </nav>
      <div className="p-3 border-t border-gray-100">
        <LanguageSwitcher />
      </div>
    </aside>
  );
}