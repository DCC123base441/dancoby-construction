import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { UserCircle, MessageCircle, ShoppingBag, MonitorPlay } from 'lucide-react';
import { useLanguage } from './LanguageContext';

const MORE_ITEMS = [
  { id: 'profile', icon: UserCircle, labelKey: 'tabProfile', color: 'bg-blue-100 text-blue-600' },
  { id: 'feedback', icon: MessageCircle, labelKey: 'tabFeedback', color: 'bg-purple-100 text-purple-600' },
  { id: 'gear', icon: ShoppingBag, labelKey: 'tabGear', color: 'bg-pink-100 text-pink-600' },
  { id: 'jobtread', icon: MonitorPlay, labelKey: 'tabJobTread', color: 'bg-cyan-100 text-cyan-600' },
];

export default function CustomerMoreSheet({ open, onOpenChange, onTabChange }) {
  const { t } = useLanguage();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl pb-8">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-base">{t('more') || 'More'}</SheetTitle>
        </SheetHeader>
        <div className="grid grid-cols-2 gap-3">
          {MORE_ITEMS.map((item) => (
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
                {t(item.labelKey) || (item.id.charAt(0).toUpperCase() + item.id.slice(1))}
              </span>
            </button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}