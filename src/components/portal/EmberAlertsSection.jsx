import React, { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Flame, Check, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";

export default function EmberAlertsSection() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const unsubscribe = base44.entities.EmberAlert.subscribe(() => {
      queryClient.invalidateQueries({ queryKey: ['emberAlerts'] });
    });
    return unsubscribe;
  }, [queryClient]);

  const { data: alerts = [], isLoading } = useQuery({
    queryKey: ['emberAlerts'],
    queryFn: () => base44.entities.EmberAlert.list('-created_date', 50),
  });

  const markRead = useMutation({
    mutationFn: (id) => base44.entities.EmberAlert.update(id, { read: true }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['emberAlerts'] }),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <Flame className="w-10 h-10 mx-auto mb-3 text-gray-300" />
        <p className="text-sm">No Ember alerts yet. When a visitor spends 5+ minutes on the site, Ember will flag it here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <Flame className="w-5 h-5 text-orange-500" />
        Ember Alerts
      </h3>
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`rounded-xl border p-4 transition-all ${
            alert.read ? 'border-gray-100 bg-white opacity-60' : 'border-orange-200 bg-orange-50/40'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg flex-shrink-0 bg-orange-100">
              <Flame className="w-4 h-4 text-orange-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-800 leading-relaxed">{alert.message}</p>
              <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                {alert.visitorPage && <span>Page: {alert.visitorPage}</span>}
                {alert.minutesOnSite && <span>{alert.minutesOnSite} min on site</span>}
                {alert.created_date && (
                  <span>{format(new Date(alert.created_date), 'MMM d, h:mm a')}</span>
                )}
              </div>
            </div>
            {!alert.read && (
              <Button
                size="sm"
                variant="ghost"
                className="text-orange-600 hover:bg-orange-100 flex-shrink-0"
                onClick={() => markRead.mutate(alert.id)}
              >
                <Check className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}