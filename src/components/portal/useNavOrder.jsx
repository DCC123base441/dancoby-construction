import { useState, useCallback } from 'react';

const STORAGE_KEY = 'employee_nav_order';

// Default bottom nav item ids (last one is always 'more')
const DEFAULT_BOTTOM_IDS = ['news', 'jobtread', 'notifications', 'profile'];

// All available nav items (excluding 'more' which is always fixed)
const ALL_NAV_IDS = ['news', 'jobtread', 'notifications', 'profile', 'salary', 'holidays', 'feedback', 'timeoff', 'raise', 'gear'];

function loadOrder() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Validate — bottom must have exactly 4 items, all valid
      if (parsed.bottom?.length === 4 && parsed.bottom.every(id => ALL_NAV_IDS.includes(id))) {
        const more = ALL_NAV_IDS.filter(id => !parsed.bottom.includes(id));
        return { bottom: parsed.bottom, more };
      }
    }
  } catch {}
  return { bottom: DEFAULT_BOTTOM_IDS, more: ALL_NAV_IDS.filter(id => !DEFAULT_BOTTOM_IDS.includes(id)) };
}

function saveOrder(bottom) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ bottom }));
}

export default function useNavOrder() {
  const [order, setOrder] = useState(loadOrder);

  const swapToBottom = useCallback((moreItemId, bottomItemId) => {
    setOrder(prev => {
      const newBottom = prev.bottom.map(id => id === bottomItemId ? moreItemId : id);
      const newMore = ALL_NAV_IDS.filter(id => !newBottom.includes(id));
      saveOrder(newBottom);
      return { bottom: newBottom, more: newMore };
    });
  }, []);

  const reorderBottom = useCallback((fromIndex, toIndex) => {
    setOrder(prev => {
      const newBottom = [...prev.bottom];
      const [moved] = newBottom.splice(fromIndex, 1);
      newBottom.splice(toIndex, 0, moved);
      saveOrder(newBottom);
      return { ...prev, bottom: newBottom };
    });
  }, []);

  const resetOrder = useCallback(() => {
    const defaultOrder = { bottom: DEFAULT_BOTTOM_IDS, more: ALL_NAV_IDS.filter(id => !DEFAULT_BOTTOM_IDS.includes(id)) };
    saveOrder(DEFAULT_BOTTOM_IDS);
    setOrder(defaultOrder);
  }, []);

  return { order, swapToBottom, reorderBottom, resetOrder };
}