import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CalendarOff, MessageSquareWarning, DollarSign, ChevronRight, Inbox, Loader2
} from 'lucide-react';
import { format } from 'date-fns';

export default function DashboardActionItems() {
  const { data: timeOffRequests = [], isLoading: loadingTO } = useQuery({
    queryKey: ['pendingTimeOff'],
    queryFn: () => base44.entities.TimeOffRequest.filter({ status: 'pending' }, '-created_date', 10),
  });

  const { data: feedback = [], isLoading: loadingFB } = useQuery({
    queryKey: ['recentFeedback'],
    queryFn: () => base44.entities.EmployeeFeedback.list('-created_date', 10),
  });

  const { data: raiseRequests = [], isLoading: loadingRR } = useQuery({
    queryKey: ['pendingRaises'],
    queryFn: () => base44.entities.RaiseRequest.filter({ status: 'pending' }, '-created_date', 10),
  });

  const isLoading = loadingTO || loadingFB || loadingRR;
  const totalItems = timeOffRequests.length + feedback.length + raiseRequests.length;

  if (isLoading) {
    return (
      <Card className="border-slate-200/60 shadow-sm">
        <CardContent className="flex justify-center py-8">
          <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
        </CardContent>
      </Card>
    );
  }

  if (totalItems === 0) return null;

  const sections = [
    {
      key: 'timeoff',
      title: 'Time Off Requests',
      icon: CalendarOff,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      badgeColor: 'bg-blue-100 text-blue-700',
      items: timeOffRequests,
      linkPage: 'AdminEmployees',
      renderItem: (item) => ({
        primary: item.userEmail,
        secondary: `${item.type || 'Time off'} · ${item.startDate ? format(new Date(item.startDate), 'MMM d') : '—'}${item.endDate ? ` – ${format(new Date(item.endDate), 'MMM d')}` : ''}`,
      }),
    },
    {
      key: 'raises',
      title: 'Raise / Review Requests',
      icon: DollarSign,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      badgeColor: 'bg-emerald-100 text-emerald-700',
      items: raiseRequests,
      linkPage: 'AdminEmployees',
      renderItem: (item) => ({
        primary: item.userEmail,
        secondary: `${item.requestType === 'raise' ? 'Raise' : 'Review'} request${item.requestedRate ? ` · $${item.requestedRate}/hr` : ''}`,
      }),
    },
    {
      key: 'feedback',
      title: 'Recent Feedback',
      icon: MessageSquareWarning,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      badgeColor: 'bg-amber-100 text-amber-700',
      items: feedback.slice(0, 5),
      linkPage: 'AdminEmployees',
      renderItem: (item) => ({
        primary: item.isAnonymous ? 'Anonymous' : (item.userEmail || 'Employee'),
        secondary: item.content?.substring(0, 80) + (item.content?.length > 80 ? '…' : ''),
        tag: item.category,
      }),
    },
  ];

  return (
    <Card className="border-slate-200/60 shadow-sm overflow-hidden">
      <CardHeader className="pb-3 bg-gradient-to-r from-slate-50 to-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base">Action Items</CardTitle>
            <Badge className="bg-red-100 text-red-700 text-[10px]">{totalItems}</Badge>
          </div>
          <Button variant="ghost" size="sm" asChild className="text-xs h-7 px-2">
            <Link to={createPageUrl('AdminEmployees')}>View All</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0 divide-y divide-slate-100">
        {sections.map((section) => {
          if (section.items.length === 0) return null;
          const Icon = section.icon;
          return (
            <div key={section.key} className="py-3 first:pt-1">
              <div className="flex items-center gap-2 mb-2.5">
                <div className={`p-1 rounded-md ${section.bg}`}>
                  <Icon className={`w-3.5 h-3.5 ${section.color}`} />
                </div>
                <span className="text-xs font-semibold text-slate-700">{section.title}</span>
                <Badge className={`text-[10px] px-1.5 ${section.badgeColor}`}>{section.items.length}</Badge>
              </div>
              <div className="space-y-1.5">
                {section.items.map((item) => {
                  const rendered = section.renderItem(item);
                  return (
                    <div key={item.id} className="flex items-center justify-between px-2.5 py-2 rounded-lg hover:bg-slate-50 group transition-colors">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-slate-800 truncate">{rendered.primary}</p>
                        <p className="text-xs text-slate-400 truncate">{rendered.secondary}</p>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                        {rendered.tag && (
                          <Badge variant="outline" className="text-[10px] capitalize">{rendered.tag}</Badge>
                        )}
                        <ChevronRight className="w-3.5 h-3.5 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}