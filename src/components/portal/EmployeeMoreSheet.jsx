import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Settings2 } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { NAV_ITEM_META } from './navItemMeta';

export default function EmployeeMoreSheet({ open, onOpenChange, onTabChange, moreIds, onCustomize }) {
  const { t } = useLanguage();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl pb-8">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-base">{t('more') || 'More'}</SheetTitle>
        </SheetHeader>
        <div className="grid grid-cols-2 gap-3">
          {moreIds.map((id) => {
            const meta = NAV_ITEM_META[id];
            if (!meta) return null;
            return (
              <button
                key={id}
                onClick={() => {
                  onTabChange(id);
                  onOpenChange(false);
                }}
                className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors text-left"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${meta.color}`}>
                  <meta.icon className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-gray-800">
                  {t(meta.labelKey) || meta.labelKey}
                </span>
              </button>
            );
          })}
        </div>
        <div className="mt-4 pt-3 border-t border-gray-100">
          <Button
            variant="ghost"
            size="sm"
            className="w-full gap-2 text-gray-500"
            onClick={() => {
              onOpenChange(false);
              onCustomize();
            }}
          >
            <Settings2 className="w-4 h-4" />
            {t('customizeNav') || 'Customize Navigation'}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}