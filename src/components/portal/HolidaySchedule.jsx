import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Sun, PartyPopper, Star, Loader2 } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { format, parseISO, isBefore, startOfDay } from 'date-fns';

const TAG_COLORS = {
  off: 'bg-red-50 text-red-700 border-red-200',
  paid: 'bg-green-50 text-green-700 border-green-200',
  working: 'bg-yellow-50 text-yellow-700 border-yellow-200',
};

const TAG_LABELS_EN = { off: 'Off', paid: 'Paid', working: 'Working' };
const TAG_LABELS_ES = { off: 'Libre', paid: 'Pagado', working: 'Laborable' };

function formatHolidayDate(holiday) {
  if (!holiday.startDate) return holiday.date || '';
  const start = parseISO(holiday.startDate);
  if (holiday.endDate && holiday.endDate !== holiday.startDate) {
    const end = parseISO(holiday.endDate);
    if (start.getMonth() === end.getMonth()) {
      return `${format(start, 'MMM d')}–${format(end, 'd, yyyy')}`;
    }
    return `${format(start, 'MMM d')} – ${format(end, 'MMM d, yyyy')}`;
  }
  return format(start, 'MMM d, yyyy');
}

export default function HolidaySchedule() {
  const { t, lang } = useLanguage();
  const tagLabels = lang === 'es' ? TAG_LABELS_ES : TAG_LABELS_EN;

  const { data: holidays = [], isLoading } = useQuery({
    queryKey: ['holidays'],
    queryFn: () => base44.entities.Holiday.list('order'),
  });

  const today = startOfDay(new Date());

  const sortedHolidays = useMemo(() => {
    return [...holidays].sort((a, b) => {
      const dateA = a.startDate ? parseISO(a.startDate) : new Date(9999, 0);
      const dateB = b.startDate ? parseISO(b.startDate) : new Date(9999, 0);
      return dateA - dateB;
    });
  }, [holidays]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <Card className="border-gray-200">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 rounded-full bg-blue-50">
            <CalendarDays className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">{t('holidaySchedule')}</h3>
            <p className="text-xs text-gray-500">{t('paidHolidays')}</p>
          </div>
        </div>

        {holidays.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">No holidays configured yet.</p>
        ) : (
          <div className="space-y-3">
            {sortedHolidays.map((holiday) => {
              const isPast = holiday.endDate 
                ? isBefore(parseISO(holiday.endDate), today) 
                : holiday.startDate ? isBefore(parseISO(holiday.startDate), today) : false;
              return (
                <div
                  key={holiday.id}
                  className={`flex items-center justify-between py-2.5 px-3 rounded-lg bg-white border border-gray-100 ${isPast ? 'opacity-50' : ''}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {holiday.category === 'jewish' ? (
                      <Star className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    ) : (
                      <PartyPopper className="w-4 h-4 text-amber-500 flex-shrink-0" />
                    )}
                    <span className="text-sm font-medium text-gray-900 truncate">
                      {holiday.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-gray-500">{formatHolidayDate(holiday)}</span>
                    <Badge className={`text-[10px] hover:bg-transparent ${TAG_COLORS[holiday.tag]}`}>
                      {tagLabels[holiday.tag]}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </CardContent>
    </Card>
  );
}