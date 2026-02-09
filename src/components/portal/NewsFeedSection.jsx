import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Badge } from "@/components/ui/badge";
import { useLanguage } from './LanguageContext';
import { Pin, Megaphone, PartyPopper, ShieldAlert, Calendar, Info, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';

const categoryConfig = {
  announcement: { icon: Megaphone, color: 'bg-blue-100 text-blue-700', label: 'Announcement', labelEs: 'Anuncio' },
  update: { icon: Info, color: 'bg-slate-100 text-slate-700', label: 'Update', labelEs: 'Actualización' },
  milestone: { icon: PartyPopper, color: 'bg-green-100 text-green-700', label: 'Milestone', labelEs: 'Logro' },
  event: { icon: Calendar, color: 'bg-purple-100 text-purple-700', label: 'Event', labelEs: 'Evento' },
  safety: { icon: ShieldAlert, color: 'bg-red-100 text-red-700', label: 'Safety', labelEs: 'Seguridad' },
  other: { icon: Info, color: 'bg-gray-100 text-gray-700', label: 'Other', labelEs: 'Otro' },
};

export default function NewsFeedSection() {
  const { lang } = useLanguage();

  const { data: news = [], isLoading } = useQuery({
    queryKey: ['companyNews'],
    queryFn: () => base44.entities.CompanyNews.filter({ isActive: true }, '-created_date', 30),
  });

  // Sort: pinned first, then by date
  const sorted = [...news].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.created_date) - new Date(a.created_date);
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
      </div>
    );
  }

  if (sorted.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <Megaphone className="w-10 h-10 mx-auto mb-3 text-gray-300" />
        <p className="text-sm">{lang === 'es' ? 'No hay noticias por ahora.' : 'No news yet. Check back later!'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <Megaphone className="w-5 h-5 text-amber-600" />
        {lang === 'es' ? 'Noticias de la Empresa' : 'Company News'}
      </h3>
      {sorted.map((item) => {
        const cat = categoryConfig[item.category] || categoryConfig.other;
        const CatIcon = cat.icon;
        return (
          <div
            key={item.id}
            className={`rounded-xl border p-4 transition-all ${
              item.pinned ? 'border-amber-200 bg-amber-50/40' : 'border-gray-100 bg-white'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg flex-shrink-0 ${cat.color.split(' ')[0]}`}>
                <CatIcon className={`w-4 h-4 ${cat.color.split(' ')[1]}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  {item.pinned && (
                    <Pin className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
                  )}
                  <h4 className="font-semibold text-gray-900 text-sm">{item.title}</h4>
                  <Badge className={`text-[10px] ${cat.color}`}>
                    {lang === 'es' ? cat.labelEs : cat.label}
                  </Badge>
                </div>
                <div className="text-sm text-gray-600 prose prose-sm max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                  <ReactMarkdown>{item.content}</ReactMarkdown>
                </div>
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                  {item.authorName && <span>{item.authorName}</span>}
                  {item.created_date && (
                    <span>{format(new Date(item.created_date), 'MMM d, yyyy')}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}