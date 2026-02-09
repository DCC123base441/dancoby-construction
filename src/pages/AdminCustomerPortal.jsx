import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import AdminLayout from '../components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users, ExternalLink, UserPlus, Send, History, FolderKanban
} from 'lucide-react';
import InviteEmployeeDialog from '../components/admin/InviteEmployeeDialog';
import InviteHistoryPanel from '../components/admin/InviteHistoryPanel';

export default function AdminCustomerPortal() {
  const [showInvite, setShowInvite] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const { data: allUsers = [] } = useQuery({
    queryKey: ['portalUsers'],
    queryFn: () => base44.entities.User.list(),
  });

  const { data: invites = [] } = useQuery({
    queryKey: ['inviteHistory'],
    queryFn: () => base44.entities.InviteHistory.list('-created_date', 100),
  });

  const customers = allUsers.filter(u => u.portalRole === 'customer');
  const pendingInvites = invites.filter(i => {
    const emails = new Set(allUsers.map(u => u.email?.toLowerCase()));
    return !emails.has(i.email?.toLowerCase()) && i.portalRole === 'customer';
  });

  return (
    <AdminLayout title="Customer Portal Management">
      <div className="space-y-6">

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <StatCard label="Active Customers" value={customers.length} icon={Users} color="blue" />
          <StatCard label="Pending Invites" value={pendingInvites.length} icon={Send} color="violet" />
          <StatCard label="Total Invites Sent" value={invites.filter(i => i.portalRole === 'customer').length} icon={History} color="emerald" />
        </div>

        {/* Actions Bar */}
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => setShowInvite(true)} className="bg-blue-600 hover:bg-blue-700">
            <UserPlus className="w-4 h-4 mr-2" />
            Invite Customer
          </Button>
          <Button variant="outline" onClick={() => setShowHistory(!showHistory)}>
            <History className="w-4 h-4 mr-2" />
            {showHistory ? 'Hide' : 'View'} Invite History
          </Button>
          <Link to={createPageUrl('CustomerPortal')}>
             <Button variant="outline" className="gap-2">
               Open Portal <ExternalLink className="w-4 h-4" />
             </Button>
          </Link>
        </div>

        {/* Invite History (collapsible) */}
        {showHistory && (
          <Card className="border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <History className="w-4 h-4 text-slate-500" />
                Invite History
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 max-h-80 overflow-y-auto">
              <InviteHistoryPanel users={allUsers} filterRole="customer" />
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-1">
          <Card className="border-slate-200 overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-blue-400 to-blue-600" />
            <CardHeader className="pb-2">
                <CardTitle>Customer Management</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <p className="text-sm text-slate-500 mb-6">
                Customers are assigned to specific projects. To manage which projects a customer can see, go to the Projects section and edit a project's assigned customer.
              </p>
              
              <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-6 flex flex-col md:flex-row items-center gap-6">
                <div className="p-4 bg-white rounded-full shadow-sm">
                    <FolderKanban className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-center md:text-left flex-1">
                    <h3 className="font-semibold text-slate-900 mb-1">Manage Customer Assignments</h3>
                    <p className="text-sm text-slate-500">
                        Assign customers to projects to give them access to their portal dashboard.
                    </p>
                </div>
                <Link to={createPageUrl('AdminProjects')}>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Go to Projects
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>

      <InviteEmployeeDialog open={showInvite} onOpenChange={setShowInvite} defaultRole="customer" />
    </AdminLayout>
  );
}

function StatCard({ label, value, icon: Icon, color }) {
  const colorMap = {
    amber: 'bg-amber-50 text-amber-600',
    blue: 'bg-blue-50 text-blue-600',
    violet: 'bg-violet-50 text-violet-600',
    emerald: 'bg-emerald-50 text-emerald-600',
  };
  return (
    <Card className="border-slate-200">
      <CardContent className="p-4 flex items-center gap-3">
        <div className={`p-2 rounded-lg ${colorMap[color]}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div>
          <p className="text-2xl font-bold text-slate-900">{value}</p>
          <p className="text-xs text-slate-500">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}