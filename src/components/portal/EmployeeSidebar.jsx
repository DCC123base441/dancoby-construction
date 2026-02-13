import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { UserCircle, MessageCircle, DollarSign, CalendarDays, CalendarOff, HandCoins, ShoppingBag, MonitorPlay, Newspaper, Bell, ClipboardCheck } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

const JOBTREAD_LOGO = "https://yt3.ggpht.com/QWox277KuhTRFhCWHnkwLJKwYyY-pIZopKYRWhFhdsggxm9Z7BFfy3VlgyEJxYdXbyNbwjdQYz4=s68-c-k-c0x00ffffff-no-rj";
const JOBTREAD_APP_URL = "https://app.jobtread.com/jobs/22PK5mC4cdUx?emailAddress=alvarezedgar681%40gmail.com";

const ALL_TABS = [
  { id: 'news', icon: Newspaper, labelKey: 'tabNews', color: 'text-indigo-600 bg-indigo-50' },
  { id: 'notifications', icon: Bell, labelKey: 'notifications', color: 'text-blue-600 bg-blue-50' },
  { id: 'jobtread', icon: MonitorPlay, labelKey: 'tabJobTread', color: 'text-cyan-600 bg-cyan-50' },
  { id: 'jobtread_app', labelKey: null, label: 'Open JobTread', color: 'text-cyan-600 bg-cyan-50', isExternal: true, externalUrl: JOBTREAD_APP_URL, logoSrc: JOBTREAD_LOGO },
  { id: 'salary', icon: DollarSign, labelKey: 'tabFinance', color: 'text-emerald-600 bg-emerald-50' },
  { id: 'feedback', icon: MessageCircle, labelKey: 'tabFeedback', color: 'text-purple-600 bg-purple-50' },
  { id: 'holidays', icon: CalendarDays, labelKey: 'tabHolidays', color: 'text-red-600 bg-red-50' },
  { id: 'timeoff', icon: CalendarOff, labelKey: 'tabTimeOff', color: 'text-orange-600 bg-orange-50' },
  { id: 'raise', icon: HandCoins, labelKey: 'tabRaise', color: 'text-amber-600 bg-amber-50' },
  { id: 'gear', icon: ShoppingBag, labelKey: 'tabGear', color: 'text-pink-600 bg-pink-50' },
  { id: 'standards', icon: ClipboardCheck, labelKey: null, label: 'Standards', color: 'text-teal-600 bg-teal-50' },
  { id: 'profile', icon: UserCircle, labelKey: 'tabProfile', color: 'text-slate-600 bg-slate-50' },
];

export default function EmployeeSidebar({ activeTab, onTabChange, user }) {
  const { t } = useLanguage();

  const { data: notifications = [] } = useQuery({
    queryKey: ['myNotifications', user?.email],
    queryFn: async () => {
      const targetUser = user || await base44.auth.me();
      return base44.entities.Notification.filter({ userEmail: targetUser.email, read: false }, '-created_date', 100);
    },
    enabled: !!(user?.email),
    staleTime: 1000 * 30,
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <aside className="hidden lg:flex flex-col w-56 flex-shrink-0 border-r border-gray-200 bg-white">
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {ALL_TABS.map((tab) => {
          if (tab.isExternal) {
            return (
              <a
                key={tab.id}
                href={tab.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${tab.color.split(' ')[1]}`}>
                  <img src={tab.logoSrc} alt="" className="w-5 h-5 rounded-full" />
                </div>
                <span className="flex-1 text-left">{tab.label}</span>
                <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </a>
            );
          }
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
              <span className="flex-1 text-left">{tab.label || t(tab.labelKey) || tab.labelKey}</span>
              {tab.id === 'notifications' && unreadCount > 0 && (
                <span className="w-5 h-5 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full">
                  {unreadCount}
                </span>
              )}
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