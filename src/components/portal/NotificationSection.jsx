import React, { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Bell, Check, Trash2, Calendar, Link as LinkIcon, ExternalLink } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import moment from 'moment';
import { Link } from 'react-router-dom';
import { useLanguage } from './LanguageContext';

export default function NotificationSection({ user }) {
  const queryClient = useQueryClient();
  const { t } = useLanguage();

  useEffect(() => {
    const unsubscribe = base44.entities.Notification.subscribe(() => {
      queryClient.invalidateQueries({ queryKey: ['myNotifications'] });
    });
    return unsubscribe;
  }, [queryClient]);

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['myNotifications', user?.email],
    queryFn: async () => {
      const targetUser = user || await base44.auth.me();
      return base44.entities.Notification.filter({ userEmail: targetUser.email?.toLowerCase() }, '-created_date', 50);
    },
    enabled: !!(user?.email),
  });

  const markAllReadMutation = useMutation({
    mutationFn: async () => {
      const unread = notifications.filter(n => !n.read);
      await Promise.all(unread.map(n => base44.entities.Notification.update(n.id, { read: true })));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myNotifications'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Notification.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myNotifications'] });
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: (id) => base44.entities.Notification.update(id, { read: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myNotifications'] });
    },
  });

  const handleNotificationClick = (n) => {
    if (!n.read) {
      markAsReadMutation.mutate(n.id);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-4">
      <Card className="border-gray-200">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 rounded-full bg-blue-50 flex-shrink-0">
                <Bell className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 truncate text-sm sm:text-base">{t('notifications')}</h3>
            </div>
            {unreadCount > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => markAllReadMutation.mutate()}
                className="text-xs flex-shrink-0 px-2 sm:px-3"
              >
                <Check className="w-3 h-3 sm:mr-1" />
                <span className="hidden sm:inline">{t('markAllRead')}</span>
              </Button>
            )}
          </div>
          <p className="text-sm text-gray-500 mb-4">
            {t('notificationDesc') || 'Stay updated with your latest alerts and messages.'}
          </p>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {isLoading ? (
            <div className="text-center py-12 text-gray-400">{t('loading')}</div>
        ) : notifications.length === 0 ? (
            <div className="text-center py-16 text-gray-400 bg-white rounded-xl border border-gray-100">
                <Bell className="w-10 h-10 mx-auto mb-3 text-gray-200" />
                <p>{t('noNotifications')}</p>
            </div>
        ) : (
            notifications.map(n => (
                <div 
                    key={n.id}
                    className={`relative p-4 rounded-xl border transition-all ${
                        !n.read 
                            ? 'bg-blue-50/40 border-blue-100 shadow-sm' 
                            : 'bg-white border-gray-100'
                    }`}
                >
                    <div className="flex gap-4">
                        <div className={`mt-1.5 w-2.5 h-2.5 rounded-full flex-shrink-0 ${!n.read ? 'bg-blue-500' : 'bg-gray-200'}`} />
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4">
                                <h4 className={`text-sm ${!n.read ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>
                                    {n.title}
                                </h4>
                                <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
                                    {moment.utc(n.created_date).local().format('MMM D, h:mm A')}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{n.message}</p>
                            
                            <div className="flex items-center justify-between mt-3">
                                {(n.type || n.link) ? (
                                    <button 
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            if (!n.read) markAsReadMutation.mutate(n.id);
                                            const tabMap = { time_off: 'timeoff', raise: 'raise', general: 'feedback', news: 'news' };
                                            const tab = tabMap[n.type] || 'news';
                                            setTimeout(() => {
                                                window.dispatchEvent(new CustomEvent('portal-tab-change', { detail: tab }));
                                            }, 0);
                                        }}
                                        className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800 py-2 px-2 -ml-2 touch-manipulation active:bg-blue-50 rounded"
                                    >
                                        <ExternalLink className="w-3 h-3" />
                                        {t('viewDetails') || 'View Details'}
                                    </button>
                                ) : (
                                    <span /> 
                                )}
                                
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-6 w-6 text-gray-300 hover:text-red-500 -mr-2"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteMutation.mutate(n.id);
                                    }}
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            ))
        )}
      </div>
    </div>
  );
}