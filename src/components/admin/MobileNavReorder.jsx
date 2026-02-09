import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  GripVertical, Smartphone, Save, RotateCcw,
  Newspaper, MonitorPlay, Bell, UserCircle, DollarSign,
  CalendarDays, MessageCircle, CalendarOff, HandCoins, ShoppingBag
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const ALL_TABS_META = {
  news: { icon: Newspaper, label: 'News', color: 'bg-indigo-100 text-indigo-600' },
  jobtread: { icon: MonitorPlay, label: 'JobTread', color: 'bg-cyan-100 text-cyan-600' },
  notifications: { icon: Bell, label: 'Notifications', color: 'bg-blue-100 text-blue-600' },
  profile: { icon: UserCircle, label: 'Profile', color: 'bg-slate-100 text-slate-600' },
  salary: { icon: DollarSign, label: 'Salary', color: 'bg-emerald-100 text-emerald-600' },
  holidays: { icon: CalendarDays, label: 'Holidays', color: 'bg-red-100 text-red-600' },
  feedback: { icon: MessageCircle, label: 'Feedback', color: 'bg-purple-100 text-purple-600' },
  timeoff: { icon: CalendarOff, label: 'Time Off', color: 'bg-orange-100 text-orange-600' },
  raise: { icon: HandCoins, label: 'Raise/Review', color: 'bg-amber-100 text-amber-600' },
  gear: { icon: ShoppingBag, label: 'Gear Shop', color: 'bg-pink-100 text-pink-600' },
};

const DEFAULT_BOTTOM = ['news', 'jobtread', 'notifications', 'profile'];
const DEFAULT_MORE = ['salary', 'holidays', 'feedback', 'timeoff', 'raise', 'gear', 'profile'];

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
      if (config.bottomNavOrder?.length) setBottomNav(config.bottomNavOrder);
      if (config.moreSheetOrder?.length) setMoreSheet(config.moreSheetOrder);
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
      toast.success('Mobile navigation updated');
    },
  });

  const handleReset = () => {
    setBottomNav(DEFAULT_BOTTOM);
    setMoreSheet(DEFAULT_MORE);
    setHasChanges(true);
  };

  const handleDragEnd = (listType) => (result) => {
    if (!result.destination) return;
    const setter = listType === 'bottom' ? setBottomNav : setMoreSheet;
    setter(prev => {
      const items = Array.from(prev);
      const [removed] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, removed);
      return items;
    });
    setHasChanges(true);
  };

  const moveToMore = (tabId) => {
    setBottomNav(prev => prev.filter(id => id !== tabId));
    setMoreSheet(prev => [...prev, tabId]);
    setHasChanges(true);
  };

  const moveToBottom = (tabId) => {
    if (bottomNav.length >= 4) {
      toast.error('Bottom nav can have max 4 items. Remove one first.');
      return;
    }
    setMoreSheet(prev => prev.filter(id => id !== tabId));
    setBottomNav(prev => [...prev, tabId]);
    setHasChanges(true);
  };

  if (isLoading) {
    return <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-500" /></div>;
  }

  return (
    <div className="space-y-4">
      {/* Bottom Nav Section */}
      <Card className="border-slate-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-amber-600" />
            Bottom Navigation Bar
            <Badge variant="outline" className="ml-auto text-xs">Max 4 items</Badge>
          </CardTitle>
          <p className="text-xs text-gray-500">"More" button is always added as the 5th item</p>
        </CardHeader>
        <CardContent className="pt-0">
          <DragDropContext onDragEnd={handleDragEnd('bottom')}>
            <Droppable droppableId="bottomNav">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-2">
                  {bottomNav.map((tabId, index) => {
                    const meta = ALL_TABS_META[tabId];
                    if (!meta) return null;
                    const Icon = meta.icon;
                    return (
                      <Draggable key={tabId} draggableId={`bottom-${tabId}`} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`flex items-center gap-3 p-3 rounded-lg border ${
                              snapshot.isDragging ? 'border-amber-300 bg-amber-50 shadow-md' : 'border-gray-200 bg-white'
                            }`}
                          >
                            <div {...provided.dragHandleProps}>
                              <GripVertical className="w-4 h-4 text-gray-400" />
                            </div>
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${meta.color}`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-medium text-gray-800 flex-1">{meta.label}</span>
                            <Badge className="text-[10px]" variant="secondary">#{index + 1}</Badge>
                            <button
                              onClick={() => moveToMore(tabId)}
                              className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </CardContent>
      </Card>

      {/* More Sheet Section */}
      <Card className="border-slate-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            "More" Sheet Items
          </CardTitle>
          <p className="text-xs text-gray-500">Items shown when the user taps "More"</p>
        </CardHeader>
        <CardContent className="pt-0">
          <DragDropContext onDragEnd={handleDragEnd('more')}>
            <Droppable droppableId="moreSheet">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-2">
                  {moreSheet.map((tabId, index) => {
                    const meta = ALL_TABS_META[tabId];
                    if (!meta) return null;
                    const Icon = meta.icon;
                    return (
                      <Draggable key={tabId} draggableId={`more-${tabId}`} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`flex items-center gap-3 p-3 rounded-lg border ${
                              snapshot.isDragging ? 'border-amber-300 bg-amber-50 shadow-md' : 'border-gray-200 bg-white'
                            }`}
                          >
                            <div {...provided.dragHandleProps}>
                              <GripVertical className="w-4 h-4 text-gray-400" />
                            </div>
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${meta.color}`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-medium text-gray-800 flex-1">{meta.label}</span>
                            {bottomNav.length < 4 && (
                              <button
                                onClick={() => moveToBottom(tabId)}
                                className="text-xs text-amber-600 hover:text-amber-700 font-medium transition-colors"
                              >
                                Move to Bar
                              </button>
                            )}
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={() => saveMutation.mutate()}
          disabled={!hasChanges || saveMutation.isPending}
          className="bg-amber-600 hover:bg-amber-700"
        >
          <Save className="w-4 h-4 mr-2" />
          {saveMutation.isPending ? 'Saving...' : 'Save Order'}
        </Button>
        <Button variant="outline" onClick={handleReset}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset to Default
        </Button>
      </div>
    </div>
  );
}