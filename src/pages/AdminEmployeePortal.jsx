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
  HardHat, ExternalLink, ChevronRight, UserPlus,
  Newspaper, CalendarDays, BookOpen, Send, History, Smartphone
} from 'lucide-react';
import InviteEmployeeDialog from '../components/admin/InviteEmployeeDialog';
import InviteHistoryPanel from '../components/admin/InviteHistoryPanel';
import DashboardActionItems from '../components/admin/DashboardActionItems';
import MobileNavReorder from '../components/admin/MobileNavReorder';

export default function AdminEmployeePortal() {
  const [showInvite, setShowInvite] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);

  const { data: allUsers = [] } = useQuery({
    queryKey: ['portalUsers'],
    queryFn: () => base44.entities.User.list(),
  });

  const { data: invites = [] } = useQuery({
    queryKey: ['inviteHistory'],
    queryFn: () => base44.entities.InviteHistory.list('-created_date', 100),
  });

  const activeEmployeeCount = allUsers.filter(u => u.portalRole === 'employee').length;
  const pendingInvites = invites.filter(i => i.status === 'pending' && i.portalRole === 'employee');

  const employeeLinks = [
    { name: "Manage Employees", href: "AdminEmployees", icon: HardHat },
    { name: "Company News", href: "AdminNews", icon: Newspaper },
    { name: "Holiday Schedule", href: "AdminHolidays", icon: CalendarDays },
    { name: "JobTread Tutorials", href: "AdminJobTread", icon: BookOpen },
    { name: "Mobile Nav Order", icon: Smartphone, action: () => setShowMobileNav(!showMobileNav) },
  ];

  return (
    <AdminLayout title="Employee Portal Management">
      <div className="space-y-6">

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <StatCard label="Active Employees" value={employees.length} icon={HardHat} color="amber" />
          <StatCard label="Pending Invites" value={pendingInvites.length} icon={Send} color="violet" />
          <StatCard label="Total Invites Sent" value={invites.filter(i => i.portalRole === 'employee').length} icon={History} color="emerald" />
        </div>

        {/* Actions Bar */}
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => setShowInvite(true)} className="bg-amber-600 hover:bg-amber-700">
            <UserPlus className="w-4 h-4 mr-2" />
            Invite Employee
          </Button>
          <Button variant="outline" onClick={() => setShowHistory(!showHistory)}>
            <History className="w-4 h-4 mr-2" />
            {showHistory ? 'Hide' : 'View'} Invite History
          </Button>
          <Link to={createPageUrl('EmployeePortal')}>
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
              <InviteHistoryPanel filterRole="employee" />
            </CardContent>
          </Card>
        )}

        {/* Action Items */}
        <DashboardActionItems />

        {/* Quick Links */}
        <Card className="border-slate-200 overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-amber-400 to-amber-600" />
            <CardHeader>
                <CardTitle>Management Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {employeeLinks.map((page) => {
                  const content = (
                    <>
                      <div className="p-2 rounded-lg bg-amber-50 group-hover:bg-amber-100 transition-colors">
                          <page.icon className="w-5 h-5 text-amber-600" />
                      </div>
                      <span className="flex-1 font-medium text-slate-700">{page.name}</span>
                      <ChevronRight className={`w-4 h-4 text-slate-300 group-hover:text-amber-500 transition-colors ${page.action && showMobileNav ? 'rotate-90' : ''}`} />
                    </>
                  );
                  if (page.action) {
                    return (
                      <button
                        key={page.name}
                        onClick={page.action}
                        className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-slate-100 bg-white shadow-sm hover:border-amber-200 hover:shadow-md transition-all group text-left"
                      >
                        {content}
                      </button>
                    );
                  }
                  return (
                    <Link
                      key={page.name}
                      to={createPageUrl(page.href)}
                      className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-slate-100 bg-white shadow-sm hover:border-amber-200 hover:shadow-md transition-all group"
                    >
                      {content}
                    </Link>
                  );
                })}
              </div>
              {showMobileNav && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <p className="text-sm text-gray-500 mb-3">Drag to reorder the bottom navigation and "More" sheet for the employee mobile app.</p>
                  <MobileNavReorder />
                </div>
              )}
            </CardContent>
        </Card>

      </div>

      <InviteEmployeeDialog open={showInvite} onOpenChange={setShowInvite} defaultRole="employee" />
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