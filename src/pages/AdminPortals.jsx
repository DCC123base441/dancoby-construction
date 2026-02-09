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
  HardHat, Users, ExternalLink, ChevronRight, UserPlus,
  Newspaper, CalendarDays, BookOpen, Send, History
} from 'lucide-react';
import InviteEmployeeDialog from '../components/admin/InviteEmployeeDialog';
import InviteHistoryPanel from '../components/admin/InviteHistoryPanel';
import DashboardActionItems from '../components/admin/DashboardActionItems';

export default function AdminPortals() {
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

  const employees = allUsers.filter(u => u.portalRole === 'employee');
  const customers = allUsers.filter(u => u.portalRole === 'customer');
  const pendingInvites = invites.filter(i => {
    const emails = new Set(allUsers.map(u => u.email?.toLowerCase()));
    return !emails.has(i.email?.toLowerCase());
  });

  const employeeLinks = [
    { name: "Manage Employees", href: "AdminEmployees", icon: HardHat },
    { name: "Company News", href: "AdminNews", icon: Newspaper },
    { name: "Holiday Schedule", href: "AdminHolidays", icon: CalendarDays },
    { name: "JobTread Tutorials", href: "AdminJobTread", icon: BookOpen },
  ];

  return (
    <AdminLayout title="Portal Management">
      <div className="space-y-6">

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Employees" value={employees.length} icon={HardHat} color="amber" />
          <StatCard label="Customers" value={customers.length} icon={Users} color="blue" />
          <StatCard label="Pending Invites" value={pendingInvites.length} icon={Send} color="violet" />
          <StatCard label="Total Users" value={allUsers.filter(u => u.portalRole).length} icon={UserPlus} color="emerald" />
        </div>

        {/* Actions Bar */}
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => setShowInvite(true)} className="bg-slate-900 hover:bg-slate-800">
            <UserPlus className="w-4 h-4 mr-2" />
            Invite User
          </Button>
          <Button variant="outline" onClick={() => setShowHistory(!showHistory)}>
            <History className="w-4 h-4 mr-2" />
            {showHistory ? 'Hide' : 'View'} Invite History
            {pendingInvites.length > 0 && (
              <Badge className="ml-2 bg-amber-100 text-amber-700 text-[10px] px-1.5">{pendingInvites.length}</Badge>
            )}
          </Button>
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
              <InviteHistoryPanel users={allUsers} />
            </CardContent>
          </Card>
        )}

        {/* Action Items */}
        <DashboardActionItems />

        {/* Portal Cards */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Employee Portal Card */}
          <Card className="border-slate-200 overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-amber-400 to-amber-600" />
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-50">
                    <HardHat className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Employee Portal</CardTitle>
                    <p className="text-xs text-slate-500 mt-0.5">{employees.length} active employee{employees.length !== 1 ? 's' : ''}</p>
                  </div>
                </div>
                <Link to={createPageUrl('EmployeePortal')}>
                  <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                    Open <ExternalLink className="w-3 h-3" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <p className="text-sm text-slate-500 mb-4">
                Manage profiles, company news, feedback, time off, holiday schedules and more.
              </p>
              <div className="grid grid-cols-2 gap-2">
                {employeeLinks.map((page) => (
                  <Link
                    key={page.name}
                    to={createPageUrl(page.href)}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-amber-50 hover:border-amber-200 text-sm text-slate-700 hover:text-amber-800 transition-all group"
                  >
                    <page.icon className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition-colors" />
                    <span className="flex-1 truncate">{page.name}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-amber-500 transition-colors" />
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Customer Portal Card */}
          <Card className="border-slate-200 overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-blue-400 to-blue-600" />
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-50">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Customer Portal</CardTitle>
                    <p className="text-xs text-slate-500 mt-0.5">{customers.length} active customer{customers.length !== 1 ? 's' : ''}</p>
                  </div>
                </div>
                <Link to={createPageUrl('CustomerPortal')}>
                  <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                    Open <ExternalLink className="w-3 h-3" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <p className="text-sm text-slate-500 mb-4">
                Customer project tracking, updates, and communication hub. Customers see their assigned projects and progress.
              </p>
              <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50/50 p-4 text-center">
                <Users className="w-5 h-5 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-400">Customer management is done via project assignments.</p>
                <Link to={createPageUrl('AdminProjects')}>
                  <Button variant="link" size="sm" className="text-xs text-blue-600 mt-1 px-0">
                    Go to Projects →
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>

      <InviteEmployeeDialog open={showInvite} onOpenChange={setShowInvite} />
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