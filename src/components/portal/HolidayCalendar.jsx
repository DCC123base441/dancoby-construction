import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
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

export default function HolidayCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const { data: holidays = [] } = useQuery({
    queryKey: ['holidays'],
    queryFn: () => base44.entities.Holiday.list('order'),
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

  const getHolidaysForDay = (day) => {
    return holidays.filter(h => {
      if (!h.startDate) return false;
      const start = parseISO(h.startDate);
      const end = h.endDate ? parseISO(h.endDate) : start;
      return isWithinInterval(day, { start, end }) || isSameDay(day, start) || isSameDay(day, end);
    });
  };

  const today = new Date();
  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className="mt-6 space-y-3">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <h3 className="text-sm font-semibold text-slate-800">
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-[10px]">
        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-400" /> Off</div>
        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-400" /> Paid</div>
        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-yellow-400" /> Working</div>
      </div>

      {/* Grid */}
      <div className="border border-slate-200 rounded-lg overflow-hidden">
        <div className="grid grid-cols-7 bg-slate-50">
          {weekDays.map((d, i) => (
            <div key={i} className="p-1.5 text-center text-[10px] font-semibold text-slate-400">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {days.map((day, i) => {
            const dayHolidays = getHolidaysForDay(day);
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isToday = isSameDay(day, today);
            const hasHoliday = dayHolidays.length > 0;
            const topHoliday = dayHolidays[0];

            // Determine dot/bg color from the top holiday
            let dotColor = '';
            if (topHoliday) {
              const tag = topHoliday.tag || 'off';
              dotColor = tag === 'off' ? 'bg-red-400' : tag === 'paid' ? 'bg-green-400' : 'bg-yellow-400';
            }

            return (
              <div
                key={i}
                className={`relative min-h-[40px] sm:min-h-[52px] border-b border-r border-slate-100 p-0.5 flex flex-col items-center ${
                  !isCurrentMonth ? 'bg-slate-50/50' : 'bg-white'
                }`}
                title={dayHolidays.map(h => `${h.name} (${TAG_LABEL[h.tag]})`).join(', ')}
              >
                <div className={`text-[11px] font-medium w-5 h-5 flex items-center justify-center rounded-full ${
                  isToday ? 'bg-amber-500 text-white' : isCurrentMonth ? 'text-slate-700' : 'text-slate-300'
                }`}>
                  {format(day, 'd')}
                </div>
                {hasHoliday && (
                  <div className={`w-1.5 h-1.5 rounded-full mt-0.5 ${dotColor}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming holidays this month */}
      {(() => {
        const monthHolidays = holidays.filter(h => {
          if (!h.startDate) return false;
          const start = parseISO(h.startDate);
          const end = h.endDate ? parseISO(h.endDate) : start;
          return start <= calEnd && end >= calStart;
        });
        if (monthHolidays.length === 0) return null;
        return (
          <div className="space-y-1.5 pt-1">
            {monthHolidays.map(h => (
              <div key={h.id} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 min-w-0">
                  {h.category === 'jewish' && <Star className="w-3 h-3 text-blue-500 flex-shrink-0" />}
                  <span className="text-slate-700 truncate">{h.name}</span>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${TAG_BG[h.tag]}`}>
                  {TAG_LABEL[h.tag]}
                </span>
              </div>
            ))}
          </div>
        );
      })()}
    </div>
  );
}