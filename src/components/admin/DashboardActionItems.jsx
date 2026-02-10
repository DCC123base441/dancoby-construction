import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Badge } from "@/components/ui/badge";
import {
  CalendarOff, MessageSquareWarning, DollarSign, Loader2, Clock, AlertCircle, CheckCircle2
} from 'lucide-react';
import { format } from 'date-fns';

function ActionCard({ title, icon: Icon, items, color, renderItem, onResolve }) {
  if (items.length === 0) return null;

  const colorStyles = {
    blue: {
      border: 'border-blue-200',
      headerBg: 'bg-blue-50',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      badge: 'bg-blue-600 text-white',
      dot: 'bg-blue-400',
    },
    emerald: {
      border: 'border-emerald-200',
      headerBg: 'bg-emerald-50',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      badge: 'bg-emerald-600 text-white',
      dot: 'bg-emerald-400',
    },
    amber: {
      border: 'border-amber-200',
      headerBg: 'bg-amber-50',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      badge: 'bg-amber-600 text-white',
      dot: 'bg-amber-400',
    },
  };

  const s = colorStyles[color];

  return (
    <div className={`rounded-xl border ${s.border} overflow-hidden bg-white`}>
      <div className={`${s.headerBg} px-4 py-3 flex items-center justify-between`}>
        <div className="flex items-center gap-2.5">
          <div className={`p-1.5 rounded-lg ${s.iconBg}`}>
            <Icon className={`w-4 h-4 ${s.iconColor}`} />
          </div>
          <span className="text-sm font-semibold text-slate-800">{title}</span>
        </div>
        <Badge className={`${s.badge} text-[10px] px-2 py-0.5 rounded-full`}>
          {items.length}
        </Badge>
      </div>
      <div className="divide-y divide-slate-100">
        {items.map((item) => {
          const rendered = renderItem(item);
          return (
            <div key={item.id} className="px-4 py-3 flex items-start gap-3">
              <div className={`w-2 h-2 rounded-full ${s.dot} mt-1.5 flex-shrink-0`} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-800 truncate">{rendered.primary}</p>
                <p className="text-xs text-slate-500 mt-0.5 truncate">{rendered.secondary}</p>
              </div>
              {rendered.tag && (
                <Badge variant="outline" className="text-[10px] capitalize flex-shrink-0 mt-0.5">{rendered.tag}</Badge>
              )}
              {onResolve && (
                <button
                  onClick={() => onResolve(item.id)}
                  className="p-1 rounded-md text-slate-300 hover:text-green-600 hover:bg-green-50 transition-colors flex-shrink-0"
                  title="Mark as resolved"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function DashboardActionItems() {
  const queryClient = useQueryClient();
  const resolveFeedbackMutation = useMutation({
    mutationFn: (id) => base44.entities.EmployeeFeedback.update(id, { resolved: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recentFeedback'] });
    },
  });

  const resolveTimeOffMutation = useMutation({
    mutationFn: (id) => base44.entities.TimeOffRequest.update(id, { status: 'approved' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingTimeOff'] });
    },
  });

  const resolveRaiseMutation = useMutation({
    mutationFn: (id) => base44.entities.RaiseRequest.update(id, { status: 'approved' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingRaises'] });
    },
  });

  const { data: timeOffRequests = [], isLoading: loadingTO } = useQuery({
    queryKey: ['pendingTimeOff'],
    queryFn: () => base44.entities.TimeOffRequest.filter({ status: 'pending' }, '-created_date', 10),
  });

  const { data: feedback = [], isLoading: loadingFB } = useQuery({
    queryKey: ['recentFeedback'],
    queryFn: () => base44.entities.EmployeeFeedback.filter({ resolved: false }, '-created_date', 10),
  });

  const { data: raiseRequests = [], isLoading: loadingRR } = useQuery({
    queryKey: ['pendingRaises'],
    queryFn: () => base44.entities.RaiseRequest.filter({ status: 'pending' }, '-created_date', 10),
  });

  const isLoading = loadingTO || loadingFB || loadingRR;
  const totalItems = timeOffRequests.length + feedback.length + raiseRequests.length;

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
      </div>
    );
  }

  if (totalItems === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-6 text-center">
        <AlertCircle className="w-5 h-5 text-slate-300 mx-auto mb-2" />
        <p className="text-sm text-slate-400">No pending action items</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-slate-500" />
        <h3 className="text-sm font-semibold text-slate-700">Needs Attention</h3>
        <Badge className="bg-red-500 text-white text-[10px] px-2 py-0 rounded-full">{totalItems}</Badge>
      </div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <ActionCard
          title="Time Off"
          icon={CalendarOff}
          color="blue"
          items={timeOffRequests}
          onResolve={(id) => resolveTimeOffMutation.mutate(id)}
          renderItem={(item) => ({
            primary: <span className="select-text">{item.userEmail}</span>,
            secondary: `${item.type || 'Time off'} · ${item.startDate ? format(new Date(item.startDate), 'MMM d') : '—'}${item.endDate ? ` – ${format(new Date(item.endDate), 'MMM d')}` : ''}`,
          })}
        />
        <ActionCard
          title="Raise / Review"
          icon={DollarSign}
          color="emerald"
          items={raiseRequests}
          onResolve={(id) => resolveRaiseMutation.mutate(id)}
          renderItem={(item) => ({
            primary: <span className="select-text">{item.userEmail}</span>,
            secondary: `${item.requestType === 'raise' ? 'Raise' : 'Review'}${item.requestedRate ? ` · $${item.requestedRate}/hr` : ''}`,
          })}
        />
        <ActionCard
          title="Feedback"
          icon={MessageSquareWarning}
          color="amber"
          items={feedback.slice(0, 5)}
          onResolve={(id) => resolveFeedbackMutation.mutate(id)}
          renderItem={(item) => ({
            primary: <span className="select-text">{item.isAnonymous ? 'Anonymous' : (item.userEmail || 'Employee')}</span>,
            secondary: item.content?.substring(0, 80) + (item.content?.length > 80 ? '…' : ''),
            tag: item.category,
          })}
        />
      </div>
    </div>
  );
}