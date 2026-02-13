import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { UserCircle, CalendarOff, HandCoins, ShoppingBag, MonitorPlay, Bell, Newspaper, DollarSign, CalendarDays, MessageCircle, ExternalLink, ClipboardList } from 'lucide-react';
import { useLanguage } from './LanguageContext';

const JOBTREAD_LOGO = "https://yt3.ggpht.com/QWox277KuhTRFhCWHnkwLJKwYyY-pIZopKYRWhFhdsggxm9Z7BFfy3VlgyEJxYdXbyNbwjdQYz4=s68-c-k-c0x00ffffff-no-rj";
const JOBTREAD_APP_URL = "https://app.jobtread.com/jobs/22PK5mC4cdUx?emailAddress=alvarezedgar681%40gmail.com";

const ITEM_META = {
  salary: { icon: DollarSign, labelKey: 'tabSalary', color: 'bg-emerald-100 text-emerald-600' },
  holidays: { icon: CalendarDays, labelKey: 'tabHolidays', color: 'bg-red-100 text-red-600' },
  feedback: { icon: MessageCircle, labelKey: 'tabFeedback', color: 'bg-purple-100 text-purple-600' },
  timeoff: { icon: CalendarOff, labelKey: 'tabTimeOff', color: 'bg-orange-100 text-orange-600' },
  raise: { icon: HandCoins, labelKey: 'tabRaise', color: 'bg-amber-100 text-amber-600' },
  gear: { icon: ShoppingBag, labelKey: 'tabGear', color: 'bg-pink-100 text-pink-600' },
  profile: { icon: UserCircle, labelKey: 'tabProfile', color: 'bg-slate-100 text-slate-600' },
  news: { icon: Newspaper, labelKey: 'tabNews', color: 'bg-indigo-100 text-indigo-600' },
  jobtread: { icon: MonitorPlay, labelKey: 'tabJobTread', color: 'bg-cyan-100 text-cyan-600' },
  notifications: { icon: Bell, labelKey: 'notifications', color: 'bg-blue-100 text-blue-600' },
  standards: { icon: ClipboardList, labelKey: 'Standards', color: 'bg-teal-100 text-teal-600' },
};

const DEFAULT_MORE = ['salary', 'holidays', 'feedback', 'timeoff', 'raise', 'gear'];

export default function EmployeeMoreSheet({ open, onOpenChange, onTabChange, navConfig }) {
  const { t } = useLanguage();

  const allKnownIds = Object.keys(ITEM_META);
  const bottomIds = navConfig?.bottomNavOrder || [];
  const savedMore = navConfig?.moreSheetOrder?.length ? navConfig.moreSheetOrder : DEFAULT_MORE;
  const missing = allKnownIds.filter(id => !bottomIds.includes(id) && !savedMore.includes(id));
  const moreIds = [...savedMore, ...missing];
  const moreItems = moreIds.map(id => ({ id, ...ITEM_META[id] })).filter(item => item.icon);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl pb-8">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-base">{t('more') || 'More'}</SheetTitle>
        </SheetHeader>
        <div className="grid grid-cols-2 gap-3">
          {moreItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onTabChange(item.id);
                onOpenChange(false);
              }}
              className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors text-left"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color}`}>
                <item.icon className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-gray-800">
                {t(item.labelKey) || item.labelKey}
              </span>
            </button>
          ))}
          {/* JobTread App quick link */}
          <a
            href={JOBTREAD_APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors text-left"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-cyan-100">
              <img src={JOBTREAD_LOGO} alt="JobTread" className="w-6 h-6 rounded-full" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-800">Open JobTread</span>
              <span className="text-[10px] text-gray-400 flex items-center gap-0.5"><ExternalLink className="w-2.5 h-2.5" /> External</span>
            </div>
          </a>
        </div>
      </SheetContent>
    </Sheet>
  );
}