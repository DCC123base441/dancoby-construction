import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import AdminLayout from '../components/admin/AdminLayout';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, CalendarDays, Palmtree, Star } from 'lucide-react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, subMonths, isSameMonth, isSameDay, isWithinInterval, parseISO } from 'date-fns';

const REASON_COLORS = {
  vacation: 'bg-blue-100 text-blue-700 border-blue-200',
  personal: 'bg-purple-100 text-purple-700 border-purple-200',
  sick: 'bg-orange-100 text-orange-700 border-orange-200',
  family: 'bg-pink-100 text-pink-700 border-pink-200',
  other: 'bg-gray-100 text-gray-700 border-gray-200',
};

const TAG_COLORS = {
  off: 'bg-red-100 text-red-700',
  paid: 'bg-green-100 text-green-700',
  working: 'bg-yellow-100 text-yellow-700',
};

export default function AdminCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const { data: holidays = [] } = useQuery({
    queryKey: ['holidays'],
    queryFn: () => base44.entities.Holiday.list('order'),
  });

  const { data: timeOff = [] } = useQuery({
    queryKey: ['timeoff-approved'],
    queryFn: () => base44.entities.TimeOffRequest.filter({ status: 'approved' }),
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

  const getEventsForDay = (day) => {
    const events = [];

    holidays.forEach(h => {
      if (!h.startDate) return;
      const start = parseISO(h.startDate);
      const end = h.endDate ? parseISO(h.endDate) : start;
      if (isWithinInterval(day, { start, end }) || isSameDay(day, start) || isSameDay(day, end)) {
        events.push({ type: 'holiday', data: h });
      }
    });

    timeOff.forEach(t => {
      if (!t.startDate || !t.endDate) return;
      const start = parseISO(t.startDate);
      const end = parseISO(t.endDate);
      if (isWithinInterval(day, { start, end }) || isSameDay(day, start) || isSameDay(day, end)) {
        events.push({ type: 'timeoff', data: t });
      }
    });

    return events;
  };

  const today = new Date();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <AdminLayout title="Calendar">
      <div className="space-y-4">
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
            <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
            <span className="text-slate-600">Paid Holiday</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span className="text-slate-600">Day Off</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span className="text-slate-600">Vacation</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
            <span className="text-slate-600">Personal</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            <span className="text-slate-600">Sick</span>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
          {/* Week day headers */}
          <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-200">
            {weekDays.map(d => (
              <div key={d} className="p-2 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide">
                {d}
              </div>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7">
            {days.map((day, i) => {
              const events = getEventsForDay(day);
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isToday = isSameDay(day, today);

              return (
                <div
                  key={i}
                  className={`min-h-[100px] lg:min-h-[120px] border-b border-r border-slate-100 p-1.5 ${
                    !isCurrentMonth ? 'bg-slate-50/50' : 'bg-white'
                  }`}
                >
                  <div className={`text-xs font-medium mb-1 w-6 h-6 flex items-center justify-center rounded-full ${
                    isToday ? 'bg-red-600 text-white' : isCurrentMonth ? 'text-slate-700' : 'text-slate-300'
                  }`}>
                    {format(day, 'd')}
                  </div>
                  <div className="space-y-0.5 overflow-hidden">
                    {events.slice(0, 3).map((ev, j) => (
                      <CalendarEvent key={j} event={ev} />
                    ))}
                    {events.length > 3 && (
                      <p className="text-[10px] text-slate-400 pl-1">+{events.length - 3} more</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

function CalendarEvent({ event }) {
  if (event.type === 'holiday') {
    const h = event.data;
    const colorClass = TAG_COLORS[h.tag] || TAG_COLORS.off;
    return (
      <div className={`text-[10px] lg:text-[11px] px-1.5 py-0.5 rounded truncate font-medium ${colorClass}`}>
        {h.category === 'jewish' && <Star className="w-2.5 h-2.5 inline mr-0.5" />}
        {h.name}
      </div>
    );
  }

  const t = event.data;
  const colorClass = REASON_COLORS[t.reason] || REASON_COLORS.other;
  return (
    <div className={`text-[10px] lg:text-[11px] px-1.5 py-0.5 rounded truncate font-medium ${colorClass}`}>
      {t.userName || t.userEmail?.split('@')[0]}
    </div>
  );
}