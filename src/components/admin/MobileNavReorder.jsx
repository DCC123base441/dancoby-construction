import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  GripVertical, Save, RotateCcw, ArrowDown, ArrowUp,
  Newspaper, MonitorPlay, Bell, UserCircle, DollarSign,
  CalendarDays, MessageCircle, CalendarOff, HandCoins, ShoppingBag
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const TAB_META = {
  news: { icon: Newspaper, label: 'News' },
  jobtread: { icon: MonitorPlay, label: 'JobTread' },
  notifications: { icon: Bell, label: 'Notifications' },
  profile: { icon: UserCircle, label: 'Profile' },
  salary: { icon: DollarSign, label: 'Salary' },
  holidays: { icon: CalendarDays, label: 'Holidays' },
  feedback: { icon: MessageCircle, label: 'Feedback' },
  timeoff: { icon: CalendarOff, label: 'Time Off' },
  raise: { icon: HandCoins, label: 'Raise/Review' },
  gear: { icon: ShoppingBag, label: 'Gear Shop' },
};

const DEFAULT_BOTTOM = ['news', 'jobtread', 'notifications', 'profile'];
const DEFAULT_MORE = ['salary', 'holidays', 'feedback', 'timeoff', 'raise', 'gear'];

export default function MobileNavReorder() {
  const queryClient = useQueryClient();
  const [bottomNav, setBottomNav] = useState(DEFAULT_BOTTOM);
  const [moreSheet, setMoreSheet] = useState(DEFAULT_MORE);
  const [hasChanges, setHasChanges] = useState(false);

  const { data: config, isLoading } = useQuery({
    queryKey: ['portalNavConfig'],
    queryFn: async () => {
      const results = await base44.entities.PortalNavConfig.filter({ configKey: 'employee_mobile_nav' });
      return results[0] || null;
    },
  });

  useEffect(() => {
    if (config) {
      const bottom = config.bottomNavOrder?.length ? [...new Set(config.bottomNavOrder)] : DEFAULT_BOTTOM;
      const more = config.moreSheetOrder?.length 
        ? [...new Set(config.moreSheetOrder)].filter(id => !bottom.includes(id))
        : DEFAULT_MORE.filter(id => !bottom.includes(id));
      setBottomNav(bottom);
      setMoreSheet(more);
    }
  }, [config]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const data = { configKey: 'employee_mobile_nav', bottomNavOrder: bottomNav, moreSheetOrder: moreSheet };
      if (config?.id) {
        await base44.entities.PortalNavConfig.update(config.id, data);
      } else {
        await base44.entities.PortalNavConfig.create(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portalNavConfig'] });
      setHasChanges(false);
      toast.success('Navigation order saved');
    },
  });

  const handleReset = () => {
    setBottomNav(DEFAULT_BOTTOM);
    setMoreSheet(DEFAULT_MORE);
    setHasChanges(true);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination } = result;
    const srcList = source.droppableId;
    const dstList = destination.droppableId;

    const getItems = (id) => id === 'bottom' ? [...bottomNav] : [...moreSheet];
    const setItems = (id, items) => id === 'bottom' ? setBottomNav(items) : setMoreSheet(items);

    if (srcList === dstList) {
      const items = getItems(srcList);
      const [removed] = items.splice(source.index, 1);
      items.splice(destination.index, 0, removed);
      setItems(srcList, items);
    } else {
      if (dstList === 'bottom' && bottomNav.length >= 4) {
        toast.error('Bottom bar can have max 4 items');
        return;
      }
      const srcItems = getItems(srcList);
      const dstItems = getItems(dstList);
      const [removed] = srcItems.splice(source.index, 1);
      dstItems.splice(destination.index, 0, removed);
      setItems(srcList, srcItems);
      setItems(dstList, dstItems);
    }
    setHasChanges(true);
  };

  if (isLoading) {
    return <div className="flex justify-center py-6"><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-amber-500" /></div>;
  }

  const renderItem = (tabId, index) => {
    const meta = TAB_META[tabId];
    if (!meta) return null;
    const Icon = meta.icon;
    return (
      <Draggable key={tabId} draggableId={tabId} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border text-sm transition-shadow ${
              snapshot.isDragging ? 'border-amber-300 bg-amber-50 shadow-lg' : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <GripVertical className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
            <Icon className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <span className="font-medium text-gray-700">{meta.label}</span>
          </div>
        )}
      </Draggable>
    );
  };

  return (
    <div className="space-y-5">
      <DragDropContext onDragEnd={handleDragEnd}>
        {/* Bottom Bar */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Bottom Bar</span>
            <span className="text-[10px] text-gray-400 bg-gray-100 rounded px-1.5 py-0.5">{bottomNav.length}/4 + More</span>
          </div>
          <Droppable droppableId="bottom">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`space-y-1.5 min-h-[48px] rounded-lg p-2 transition-colors ${
                  snapshot.isDraggingOver ? 'bg-amber-50 border border-dashed border-amber-300' : 'bg-gray-50 border border-dashed border-gray-200'
                }`}
              >
                {bottomNav.map((id, i) => renderItem(id, i))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-200" />
          <div className="flex items-center gap-1 text-gray-400">
            <ArrowUp className="w-3 h-3" />
            <span className="text-[10px]">drag between</span>
            <ArrowDown className="w-3 h-3" />
          </div>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* More Sheet */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">"More" Menu</span>
            <span className="text-[10px] text-gray-400 bg-gray-100 rounded px-1.5 py-0.5">{moreSheet.length} items</span>
          </div>
          <Droppable droppableId="more">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`space-y-1.5 min-h-[48px] rounded-lg p-2 transition-colors ${
                  snapshot.isDraggingOver ? 'bg-violet-50 border border-dashed border-violet-300' : 'bg-gray-50 border border-dashed border-gray-200'
                }`}
              >
                {moreSheet.map((id, i) => renderItem(id, i))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>

      <div className="flex gap-2 pt-1">
        <Button
          size="sm"
          onClick={() => saveMutation.mutate()}
          disabled={!hasChanges || saveMutation.isPending}
          className="bg-amber-600 hover:bg-amber-700"
        >
          <Save className="w-3.5 h-3.5 mr-1.5" />
          {saveMutation.isPending ? 'Saving...' : 'Save'}
        </Button>
        <Button size="sm" variant="ghost" onClick={handleReset} className="text-gray-500">
          <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
          Reset
        </Button>
      </div>
    </div>
  );
}