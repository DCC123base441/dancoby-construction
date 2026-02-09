import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { UserCircle, MessageCircle, DollarSign, CalendarDays, Menu, Newspaper } from 'lucide-react';
import { useLanguage } from './LanguageContext';

const NAV_ITEMS = [
  { id: 'news', icon: Newspaper, labelKey: 'tabNews' },
  { id: 'salary', icon: DollarSign, labelKey: 'tabSalary' },
  { id: 'holidays', icon: CalendarDays, labelKey: 'tabHolidays' },
  { id: 'more', icon: Menu, labelKey: 'more' },
];

export default function EmployeeBottomNav({ activeTab, onTabChange, onMorePress }) {
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
    // Add others if they appear in bottom nav
  };
  
  const hasHiddenNotifications = notifications.some(n => 
    ['time_off', 'raise', 'general'].includes(n.type) && !['news', 'salary', 'holidays'].includes(activeTab)
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 lg:hidden safe-area-bottom">
      <div className="flex items-center justify-around py-1.5 px-2">
        {NAV_ITEMS.map((item) => {
          const isActive = item.id === 'more' ? false : activeTab === item.id;
          const handleClick = item.id === 'more' ? onMorePress : () => onTabChange(item.id);
          return (
            <button
              key={item.id}
              onClick={handleClick}
              className={`flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-xl transition-all min-w-[60px] ${
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
              <span className="text-[10px] font-medium leading-tight">
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