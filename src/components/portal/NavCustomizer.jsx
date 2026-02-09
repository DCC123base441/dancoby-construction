import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { GripVertical, ArrowLeftRight, RotateCcw } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { NAV_ITEM_META } from './navItemMeta';

export default function NavCustomizer({ open, onOpenChange, order, swapToBottom, reorderBottom, resetOrder }) {
  const { t } = useLanguage();
  const [swapMode, setSwapMode] = useState(null); // { from: 'bottom'|'more', id: string }

  const handleItemClick = (source, id) => {
    if (!swapMode) {
      // First selection
      setSwapMode({ from: source, id });
    } else if (swapMode.from !== source) {
      // Second selection from opposite group — swap
      if (swapMode.from === 'more') {
        swapToBottom(swapMode.id, id);
      } else {
        swapToBottom(id, swapMode.id);
      }
      setSwapMode(null);
    } else {
      // Same group — re-select
      setSwapMode({ from: source, id });
    }
  };

  const handleReset = () => {
    resetOrder();
    setSwapMode(null);
  };

  return (
    <Sheet open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) setSwapMode(null); }}>
      <SheetContent side="bottom" className="rounded-t-2xl pb-8 max-h-[80vh] overflow-y-auto">
        <SheetHeader className="pb-2">
          <SheetTitle className="text-base">{t('customizeNav') || 'Customize Navigation'}</SheetTitle>
        </SheetHeader>

        <p className="text-xs text-gray-500 mb-4">
          {t('customizeNavDesc') || 'Tap an item from the bottom bar, then tap one from "More" to swap them.'}
        </p>

        {/* Bottom bar items */}
        <div className="mb-4">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            {t('bottomBar') || 'Bottom Bar'}
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {order.bottom.map((id) => {
              const meta = NAV_ITEM_META[id];
              if (!meta) return null;
              const isSelected = swapMode?.from === 'bottom' && swapMode?.id === id;
              return (
                <button
                  key={id}
                  onClick={() => handleItemClick('bottom', id)}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                    isSelected
                      ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-200'
                      : 'border-gray-100 hover:border-gray-200 bg-white'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${meta.color}`}>
                    <meta.icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-gray-800 truncate">
                    {t(meta.labelKey) || meta.labelKey}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {swapMode && (
          <div className="flex items-center justify-center gap-2 mb-3 text-amber-600">
            <ArrowLeftRight className="w-4 h-4" />
            <span className="text-xs font-medium">{t('tapToSwap') || 'Now tap an item below to swap'}</span>
          </div>
        )}

        {/* More items */}
        <div className="mb-4">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            {t('moreItems') || 'More Menu'}
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {order.more.map((id) => {
              const meta = NAV_ITEM_META[id];
              if (!meta) return null;
              const isSelected = swapMode?.from === 'more' && swapMode?.id === id;
              return (
                <button
                  key={id}
                  onClick={() => handleItemClick('more', id)}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                    isSelected
                      ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-200'
                      : 'border-gray-100 hover:border-gray-200 bg-white'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${meta.color}`}>
                    <meta.icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-gray-800 truncate">
                    {t(meta.labelKey) || meta.labelKey}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <Button variant="outline" size="sm" onClick={handleReset} className="w-full gap-2">
          <RotateCcw className="w-3.5 h-3.5" />
          {t('resetDefault') || 'Reset to Default'}
        </Button>
      </SheetContent>
    </Sheet>
  );
}