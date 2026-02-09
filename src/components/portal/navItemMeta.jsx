import { UserCircle, MessageCircle, DollarSign, CalendarDays, CalendarOff, HandCoins, ShoppingBag, MonitorPlay, Newspaper, Bell } from 'lucide-react';

export const NAV_ITEM_META = {
  news:          { icon: Newspaper,      labelKey: 'tabNews',      color: 'bg-indigo-100 text-indigo-600' },
  jobtread:      { icon: MonitorPlay,    labelKey: 'tabJobTread',  color: 'bg-cyan-100 text-cyan-600' },
  notifications: { icon: Bell,           labelKey: 'notifications',color: 'bg-blue-100 text-blue-600' },
  profile:       { icon: UserCircle,     labelKey: 'tabProfile',   color: 'bg-slate-100 text-slate-600' },
  salary:        { icon: DollarSign,     labelKey: 'tabSalary',    color: 'bg-emerald-100 text-emerald-600' },
  holidays:      { icon: CalendarDays,   labelKey: 'tabHolidays',  color: 'bg-red-100 text-red-600' },
  feedback:      { icon: MessageCircle,  labelKey: 'tabFeedback',  color: 'bg-purple-100 text-purple-600' },
  timeoff:       { icon: CalendarOff,    labelKey: 'tabTimeOff',   color: 'bg-orange-100 text-orange-600' },
  raise:         { icon: HandCoins,      labelKey: 'tabRaise',     color: 'bg-amber-100 text-amber-600' },
  gear:          { icon: ShoppingBag,    labelKey: 'tabGear',      color: 'bg-pink-100 text-pink-600' },
};