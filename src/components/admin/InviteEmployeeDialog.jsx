import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Mail } from 'lucide-react';
import { toast } from 'sonner';

export default function InviteEmployeeDialog({ open, onOpenChange }) {
  const [email, setEmail] = useState('');
  const [portalRole, setPortalRole] = useState('employee');
  const [sending, setSending] = useState(false);
  const queryClient = useQueryClient();

  const handleInvite = async () => {
    if (!email.trim()) return;
    setSending(true);
    try {
      await base44.functions.invoke('inviteEmployee', {
        email: email.trim(),
        role: 'user',
        portalRole
      });
      toast.success(`Invitation sent to ${email}`);
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      setEmail('');
      setPortalRole('employee');
      onOpenChange(false);
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Failed to send invite');
    }
    setSending(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-amber-600" />
            Invite Employee
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Email address</Label>
            <Input
              type="email"
              placeholder="employee@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Portal role</Label>
            <Select value={portalRole} onValueChange={setPortalRole}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="employee">Employee</SelectItem>
                <SelectItem value="customer">Customer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleInvite} disabled={!email.trim() || sending} className="bg-amber-600 hover:bg-amber-700">
            {sending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Mail className="w-4 h-4 mr-2" />}
            Send Invite
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}