import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Sun, PartyPopper } from 'lucide-react';

const HOLIDAYS_2025 = [
  { name: "New Year's Day", date: "Jan 1", status: "past" },
  { name: "Martin Luther King Jr. Day", date: "Jan 20", status: "past" },
  { name: "Presidents' Day", date: "Feb 17", status: "upcoming" },
  { name: "Memorial Day", date: "May 26", status: "upcoming" },
  { name: "Independence Day", date: "Jul 4", status: "upcoming" },
  { name: "Labor Day", date: "Sep 1", status: "upcoming" },
  { name: "Thanksgiving", date: "Nov 27–28", status: "upcoming" },
  { name: "Christmas Eve & Day", date: "Dec 24–25", status: "upcoming" },
];

export default function HolidaySchedule() {
  const today = new Date();

  return (
    <Card className="border-gray-200">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 rounded-full bg-blue-50">
            <CalendarDays className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">2025 Holiday Schedule</h3>
            <p className="text-xs text-gray-500">Company-observed paid holidays</p>
          </div>
        </div>

        <div className="space-y-3">
          {HOLIDAYS_2025.map((holiday, i) => {
            const isPast = holiday.status === "past";
            return (
              <div
                key={i}
                className={`flex items-center justify-between py-2.5 px-3 rounded-lg ${
                  isPast ? 'bg-gray-50 opacity-60' : 'bg-white border border-gray-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <PartyPopper className={`w-4 h-4 ${isPast ? 'text-gray-300' : 'text-amber-500'}`} />
                  <span className={`text-sm font-medium ${isPast ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                    {holiday.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">{holiday.date}</span>
                  {isPast && <Badge variant="outline" className="text-[10px] text-gray-400">Past</Badge>}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-5 p-3 rounded-lg bg-blue-50 text-blue-700">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Sun className="w-4 h-4" />
            Summer Hours
          </div>
          <p className="text-xs mt-1 text-blue-600">
            During June–August, Friday hours are 7 AM – 1 PM.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}