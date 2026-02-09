import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { UserCircle, MessageCircle, DollarSign, CalendarDays, Menu, Newspaper } from 'lucide-react';
import { useLanguage } from './LanguageContext';

const NAV_ITEMS = [
  { id: 'news', icon: Newspaper, labelKey: 'tabNews' },
  { id: 'finances', icon: DollarSign, labelKey: 'tabFinances' },
  { id: 'holidays', icon: CalendarDays, labelKey: 'tabHolidays' },
  { id: 'more', icon: Menu, labelKey: 'more' },
];

export default function CustomerBottomNav({ activeTab, onTabChange, onMorePress }) {
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
  };
  
  const hasHiddenNotifications = notifications.some(n => 
    !['news', 'finances', 'holidays'].includes(activeTab)
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 lg:hidden safe-area-bottom">
      <div className="flex items-center justify-around py-1.5 px-2">
        {NAV_ITEMS.map((item) => {
          const isActive = item.id === 'more' ? false : activeTab === item.id;
          
          if (item.id === 'finances') {
             return (
               <a
                 key={item.id}
                 href="https://app.jobtread.com/login"
                 target="_blank"
                 rel="noopener noreferrer"
                 className={`flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-xl transition-all min-w-[60px] text-gray-400 hover:text-gray-600`}
               >
                 <div className="relative">
                   <item.icon className={`w-5 h-5`} />
                 </div>
                 <span className="text-[10px] font-medium leading-tight">
                   {t(item.labelKey) || item.id.charAt(0).toUpperCase() + item.id.slice(1)}
                 </span>
               </a>
             );
          }

          const handleClick = item.id === 'more' ? onMorePress : () => onTabChange(item.id);
          return (
            <button
              key={item.id}
              onClick={handleClick}
              className={`flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-xl transition-all min-w-[60px] ${
                isActive
                  ? 'text-blue-600'
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
                {item.id === 'more' ? (t('more') || 'More') : (t(item.labelKey) || item.id.charAt(0).toUpperCase() + item.id.slice(1))}
              </span>
              {isActive && (
                <div className="w-4 h-0.5 rounded-full bg-blue-500 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}