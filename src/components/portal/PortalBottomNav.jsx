import React from 'react';
import { UserCircle, MessageCircle, DollarSign, CalendarDays, Menu } from 'lucide-react';
import { useLanguage } from './LanguageContext';

const NAV_ITEMS = [
  { id: 'salary', icon: DollarSign, labelKey: 'tabSalary' },
  { id: 'holidays', icon: CalendarDays, labelKey: 'tabHolidays' },
  { id: 'feedback', icon: MessageCircle, labelKey: 'tabFeedback' },
  { id: 'more', icon: Menu, labelKey: 'more' },
];

export default function PortalBottomNav({ activeTab, onTabChange, onMorePress }) {
  const { t } = useLanguage();

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
              <item.icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : ''}`} />
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