import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Bell, Check, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import moment from 'moment';
import { Link } from 'react-router-dom';

export default function NotificationCenter({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

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
      return base44.entities.Notification.filter({ userEmail: targetUser.email?.toLowerCase() }, '-created_date', 20);
    },
    enabled: !!(user?.email),
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsReadMutation = useMutation({
    mutationFn: (id) => base44.entities.Notification.update(id, { read: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myNotifications'] });
    },
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

  const handleNotificationClick = (n) => {
    if (!n.read) {
      markAsReadMutation.mutate(n.id);
    }
    if (n.link) {
        setIsOpen(false);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button className="relative flex items-center justify-center w-9 h-9 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-3 border-b border-slate-100">
          <h4 className="font-semibold text-sm text-slate-900">Notifications</h4>
          {unreadCount > 0 && (
            <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 text-xs text-blue-600 hover:text-blue-700 p-0 hover:bg-transparent"
                onClick={() => markAllReadMutation.mutate()}
            >
                Mark all read
            </Button>
          )}
        </div>
        <ScrollArea className="h-[300px]">
          {isLoading ? (
            <div className="p-4 text-center text-xs text-slate-400">Loading...</div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">
              No notifications yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {notifications.map((n) => (
                <div 
                    key={n.id} 
                    className={`p-3 hover:bg-slate-50 transition-colors ${!n.read ? 'bg-blue-50/30' : ''} cursor-pointer`}
                    onClick={() => handleNotificationClick(n)}
                >
                    {n.link ? (
                        <Link to={n.link} className="block">
                            <NotificationContent n={n} />
                        </Link>
                    ) : (
                        <NotificationContent n={n} />
                    )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}

function NotificationContent({ n }) {
    return (
        <div className="flex gap-3">
            <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${!n.read ? 'bg-blue-500' : 'bg-transparent'}`} />
            <div className="flex-1">
                <p className={`text-sm ${!n.read ? 'font-semibold text-slate-900' : 'text-slate-700'}`}>
                    {n.title}
                </p>
                <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                    {n.message}
                </p>
                <p className="text-[10px] text-slate-400 mt-1.5">
                    {moment(n.created_date).format('MMM D, h:mm A')}
                </p>
            </div>
        </div>
    );
}