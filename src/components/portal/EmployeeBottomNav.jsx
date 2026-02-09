import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { UserCircle, MessageCircle, DollarSign, CalendarDays, CalendarOff, HandCoins, ShoppingBag, Menu, Newspaper, MonitorPlay, Bell } from 'lucide-react';
import { useLanguage } from './LanguageContext';

const ICON_MAP = {
  news: Newspaper,
  jobtread: MonitorPlay,
  notifications: Bell,
  profile: UserCircle,
  salary: DollarSign,
  holidays: CalendarDays,
  feedback: MessageCircle,
  timeoff: CalendarOff,
  raise: HandCoins,
  gear: ShoppingBag,
};

const LABEL_MAP = {
  news: 'tabNews',
  jobtread: 'tabJobTread',
  notifications: 'notifications',
  profile: 'tabProfile',
  salary: 'tabSalary',
  holidays: 'tabHolidays',
  feedback: 'tabFeedback',
  timeoff: 'tabTimeOff',
  raise: 'tabRaise',
  gear: 'tabGear',
};

const DEFAULT_NAV = ['news', 'jobtread', 'notifications', 'profile'];

export default function EmployeeBottomNav({ activeTab, onTabChange, onMorePress, user, navConfig }) {
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

  const bottomIds = navConfig?.bottomNavOrder?.length ? navConfig.bottomNavOrder : DEFAULT_NAV;
  const navItems = [
    ...bottomIds.map(id => ({ id, icon: ICON_MAP[id], labelKey: LABEL_MAP[id] })).filter(i => i.icon),
    { id: 'more', icon: Menu, labelKey: 'more' },
  ];

  const counts = {
    news: notifications.filter(n => n.type === 'news').length,
  };
  
  const hasHiddenNotifications = notifications.some(n => 
    !n.read && !bottomIds.includes(activeTab)
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 lg:hidden safe-area-bottom">
      <div className="flex items-center justify-around py-1.5 px-2">
        {navItems.map((item) => {
          const isActive = item.id === 'more' ? false : activeTab === item.id;
          const handleClick = item.id === 'more' ? onMorePress : () => onTabChange(item.id);
          return (
            <button
              key={item.id}
              onClick={handleClick}
              className={`flex flex-col items-center gap-0.5 py-1.5 px-1.5 sm:px-3 rounded-xl transition-all min-w-0 flex-1 ${
                isActive
                  ? 'text-amber-600'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <div className="relative">
                <item.icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : ''}`} />
                {((counts[item.id] > 0) || (item.id === 'more' && hasHiddenNotifications)) && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-white" />
                )}
              </div>
              <span className="text-[10px] font-medium leading-tight truncate max-w-[56px]">
                {item.id === 'more' ? (t('more') || 'More') : t(item.labelKey)}
              </span>
              {isActive && (
                <div className="w-4 h-0.5 rounded-full bg-amber-500 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}