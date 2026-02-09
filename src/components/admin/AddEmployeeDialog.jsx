import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, UserPlus } from 'lucide-react';
import { toast } from 'sonner';

export default function AddEmployeeDialog({ open, onOpenChange }) {
  const [form, setForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    position: '',
    department: '',
    phone: '',
    hourlySalary: '',
    startDate: '',
    portalRole: 'employee',
  });
  const [saving, setSaving] = useState(false);
  const queryClient = useQueryClient();

  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const handleAdd = async () => {
    if (!form.email.trim()) {
      toast.error('Email is required');
      return;
    }
    setSaving(true);
    try {
      // Step 1: Invite user to the platform (sends them login access)
      let inviteSucceeded = false;
      try {
        await base44.users.inviteUser(form.email.trim(), 'user');
        inviteSucceeded = true;
      } catch (e) {
        // Invite may fail if user already exists or other platform issues — continue to create profile
        console.log('Invite note:', e?.message || e);
      }

      // Step 2: Create their employee profile
      await base44.entities.EmployeeProfile.create({
        userEmail: form.email.trim(),
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        position: form.position.trim() || 'Employee',
        department: form.department.trim(),
        phone: form.phone.trim(),
        hourlySalary: form.hourlySalary ? Number(form.hourlySalary) : undefined,
        startDate: form.startDate || undefined,
      });

      // Step 3: Log invite history
      try {
        const me = await base44.auth.me();
        await base44.entities.InviteHistory.create({
          email: form.email.trim(),
          portalRole: form.portalRole,
          invitedBy: me.email,
          status: 'pending',
        });
      } catch (e) {
        // Non-critical
      }

      if (inviteSucceeded) {
        toast.success(`${form.firstName || form.email} added & invited successfully`);
      } else {
        toast.success(`${form.firstName || form.email} profile created. Invite them from Dashboard → Overview → Invite Users so they can log in.`);
      }
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      queryClient.invalidateQueries({ queryKey: ['adminProfiles'] });
      queryClient.invalidateQueries({ queryKey: ['inviteHistory'] });
      setForm({
        email: '', firstName: '', lastName: '', position: '',
        department: '', phone: '', hourlySalary: '', startDate: '', portalRole: 'employee',
      });
      onOpenChange(false);
    } catch (err) {
      toast.error(err?.response?.data?.error || err?.message || 'Failed to add employee');
    }
    setSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-amber-600" />
            Add New Employee
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>First Name</Label>
              <Input placeholder="John" value={form.firstName} onChange={(e) => update('firstName', e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Last Name</Label>
              <Input placeholder="Doe" value={form.lastName} onChange={(e) => update('lastName', e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Email address *</Label>
            <Input type="email" placeholder="employee@example.com" value={form.email} onChange={(e) => update('email', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Position</Label>
              <Input placeholder="e.g. Carpenter" value={form.position} onChange={(e) => update('position', e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Department</Label>
              <Input placeholder="e.g. Construction" value={form.department} onChange={(e) => update('department', e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Phone</Label>
              <Input type="tel" placeholder="(555) 123-4567" value={form.phone} onChange={(e) => update('phone', e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Hourly Wage ($)</Label>
              <Input type="number" placeholder="25" value={form.hourlySalary} onChange={(e) => update('hourlySalary', e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Start Date</Label>
              <Input type="date" value={form.startDate} onChange={(e) => update('startDate', e.target.value)} />
            </div>
            <div className="space-y-1.5">
               <Label>Portal Role</Label>
               <Select value={form.portalRole} onValueChange={(v) => update('portalRole', v)}>
                 <SelectTrigger>
                   <SelectValue />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="employee">Employee</SelectItem>
                   <SelectItem value="manager">Manager</SelectItem>
                   <SelectItem value="customer">Customer</SelectItem>
                 </SelectContent>
               </Select>
             </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleAdd} disabled={!form.email.trim() || saving} className="bg-amber-600 hover:bg-amber-700">
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <UserPlus className="w-4 h-4 mr-2" />}
            Add Employee
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}