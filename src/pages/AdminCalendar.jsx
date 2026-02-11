import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import AdminLayout from '../components/admin/AdminLayout';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { toast } from "sonner";
import {
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  addDays, addMonths, subMonths, isSameMonth, isSameDay,
  isWithinInterval, parseISO
} from 'date-fns';


const TAG_BG = {
  off: 'bg-red-100 text-red-700',
  paid: 'bg-green-100 text-green-700',
  working: 'bg-yellow-100 text-yellow-700',
};

const TAG_LABEL = { off: 'Off', paid: 'Paid', working: 'Working' };

export default function AdminCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const queryClient = useQueryClient();

  const { data: holidays = [] } = useQuery({
    queryKey: ['holidays'],
    queryFn: () => base44.entities.Holiday.list('order'),
  });

  const toggleTagMutation = useMutation({
    mutationFn: ({ id, currentTag }) => {
      // Cycle: off -> paid -> working -> off
      const cycle = ['off', 'paid', 'working'];
      const nextIdx = (cycle.indexOf(currentTag) + 1) % cycle.length;
      return base44.entities.Holiday.update(id, { tag: cycle[nextIdx] });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['holidays'] });
      toast.success('Holiday tag updated');
    },
  });

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const days = useMemo(() => {
    const result = [];
    let day = calStart;
    while (day <= calEnd) {
      result.push(day);
      day = addDays(day, 1);
    }
    return result;
  }, [calStart, calEnd]);

  // Get holidays that fall within the current month view for the sidebar
  const monthHolidays = useMemo(() => {
    return holidays.filter(h => {
      if (!h.startDate) return false;
      const start = parseISO(h.startDate);
      const end = h.endDate ? parseISO(h.endDate) : start;
      return (start <= calEnd && end >= calStart);
    });
  }, [holidays, calStart, calEnd]);

  const getHolidaysForDay = (day) => {
    return holidays.filter(h => {
      if (!h.startDate) return false;
      const start = parseISO(h.startDate);
      const end = h.endDate ? parseISO(h.endDate) : start;
      return isWithinInterval(day, { start, end }) || isSameDay(day, start) || isSameDay(day, end);
    });
  };

  const today = new Date();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <AdminLayout title="Calendar">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Calendar */}
        <div className="flex-1 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <h2 className="text-xl font-semibold text-slate-900 min-w-[180px] text-center">
                {format(currentMonth, 'MMMM yyyy')}
              </h2>
              <Button variant="outline" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <Button variant="outline" size="sm" onClick={() => setCurrentMonth(new Date())}>
              Today
            </Button>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span className="text-slate-600">Off</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
              <span className="text-slate-600">Paid</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
              <span className="text-slate-600">Working</span>
            </div>
          </div>

          {/* Grid */}
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
            <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-200">
              {weekDays.map(d => (
                <div key={d} className="p-2 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {days.map((day, i) => {
                const dayHolidays = getHolidaysForDay(day);
                const isCurrentMonth = isSameMonth(day, currentMonth);
                const isToday = isSameDay(day, today);

                return (
                  <div
                    key={i}
                    className={`min-h-[90px] lg:min-h-[110px] border-b border-r border-slate-100 p-1.5 ${
                      !isCurrentMonth ? 'bg-slate-50/50' : 'bg-white'
                    }`}
                  >
                    <div className={`text-xs font-medium mb-1 w-6 h-6 flex items-center justify-center rounded-full ${
                      isToday ? 'bg-red-600 text-white' : isCurrentMonth ? 'text-slate-700' : 'text-slate-300'
                    }`}>
                      {format(day, 'd')}
                    </div>
                    <div className="space-y-0.5 overflow-hidden">
                      {dayHolidays.slice(0, 3).map((h, j) => (
                        <div key={j} className={`text-[10px] lg:text-[11px] px-1.5 py-0.5 rounded truncate font-medium ${TAG_BG[h.tag] || TAG_BG.off}`}>
                          {h.category === 'jewish' && <Star className="w-2.5 h-2.5 inline mr-0.5" />}
                          {h.name}
                        </div>
                      ))}
                      {dayHolidays.length > 3 && (
                        <p className="text-[10px] text-slate-400 pl-1">+{dayHolidays.length - 3} more</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar - Holiday toggles */}
        <div className="lg:w-72 flex-shrink-0">
          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-1 sticky top-4">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">
              Holidays This Month
            </h3>
            {monthHolidays.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No holidays this month</p>
            ) : (
              monthHolidays.map(h => (
                <div key={h.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                  <div className="min-w-0 flex-1 mr-2">
                    <div className="flex items-center gap-1.5">
                      {h.category === 'jewish' && <Star className="w-3 h-3 text-blue-500 flex-shrink-0" />}
                      <p className="text-sm font-medium text-slate-800 truncate">{h.name}</p>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      {h.startDate}{h.endDate && h.endDate !== h.startDate ? ` → ${h.endDate}` : ''}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleTagMutation.mutate({ id: h.id, currentTag: h.tag })}
                    className={`text-[10px] font-semibold px-2.5 py-1 rounded-full cursor-pointer transition-colors ${TAG_BG[h.tag]}`}
                  >
                    {TAG_LABEL[h.tag]}
                  </button>
                </div>
              ))
            )}
            <p className="text-[10px] text-slate-400 pt-2">Click a tag to cycle: Off → Paid → Working</p>
          </div>

        </div>
      </div>
    </AdminLayout>
  );
}