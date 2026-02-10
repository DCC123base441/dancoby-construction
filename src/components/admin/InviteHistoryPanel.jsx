import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle2, Mail, Loader2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

export default function InviteHistoryPanel({ users = [] }) {
  const queryClient = useQueryClient();

  const { data: invites = [], isLoading } = useQuery({
    queryKey: ['inviteHistory'],
    queryFn: () => base44.entities.InviteHistory.list('-created_date', 50),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.InviteHistory.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['inviteHistory'] }),
  });

  // Check if invited email matches an existing user to determine accepted status
  const userEmails = new Set(users.map(u => u.email?.toLowerCase()));

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
      </div>
    );
  }

  if (invites.length === 0) {
    return (
      <div className="text-center py-8 text-slate-400">
        <Mail className="w-8 h-8 mx-auto mb-2 text-slate-300" />
        <p className="text-sm">No invitations sent yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {invites.map((inv) => {
        const accepted = userEmails.has(inv.email?.toLowerCase());
        return (
          <div key={inv.id} className="p-3 rounded-lg border border-slate-100 bg-white space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className={`p-1.5 rounded-full flex-shrink-0 ${accepted ? 'bg-green-50' : 'bg-amber-50'}`}>
                  {accepted ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  ) : (
                    <Clock className="w-4 h-4 text-amber-600" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{inv.email}</p>
                  <p className="text-xs text-slate-400">
                    Invited by {inv.invitedBy || 'admin'} · {inv.created_date ? format(new Date(inv.created_date), 'MMM d, yyyy') : '—'}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-slate-400 hover:text-red-600 hover:bg-red-50 flex-shrink-0"
                onClick={() => deleteMutation.mutate(inv.id)}
                disabled={deleteMutation.isPending}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
            <div className="flex items-center gap-2 pl-10">
              <Badge variant="outline" className="text-xs capitalize">{inv.portalRole}</Badge>
              <Badge className={`text-xs ${accepted ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                {accepted ? 'Accepted' : 'Pending'}
              </Badge>
            </div>
          </div>
        );
      })}
    </div>
  );
}