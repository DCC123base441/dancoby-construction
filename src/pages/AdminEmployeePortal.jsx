import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import AdminLayout from '../components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  HardHat, ExternalLink, ChevronRight, UserPlus,
  Newspaper, CalendarDays, BookOpen, Send, History, Smartphone, DollarSign, ClipboardList
} from 'lucide-react';
import InviteEmployeeDialog from '../components/admin/InviteEmployeeDialog';
import InviteHistoryPanel from '../components/admin/InviteHistoryPanel';
import DashboardActionItems from '../components/admin/DashboardActionItems';
import MobileNavReorder from '../components/admin/MobileNavReorder';
import BonusShareConfig from '../components/admin/BonusShareConfig';
import MoodTracker from '../components/admin/MoodTracker';

export default function AdminEmployeePortal() {
  const [showInvite, setShowInvite] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [showBonusConfig, setShowBonusConfig] = useState(false);

  const queryClient = useQueryClient();

  const { data: allUsers = [] } = useQuery({
    queryKey: ['portalUsers'],
    queryFn: () => base44.entities.User.list(),
  });

  const { data: invites = [] } = useQuery({
    queryKey: ['inviteHistory'],
    queryFn: () => base44.entities.InviteHistory.list('-created_date', 100),
  });

  const { data: employeeProfiles = [] } = useQuery({
    queryKey: ['employeeProfiles'],
    queryFn: () => base44.entities.EmployeeProfile.list(),
  });

  // Real-time sync for users, invites, and employee profiles — force immediate refetch
  useEffect(() => {
    const unsubUser = base44.entities.User.subscribe(() => {
      queryClient.invalidateQueries({ queryKey: ['portalUsers'] });
      queryClient.refetchQueries({ queryKey: ['portalUsers'] });
    });
    const unsubInvite = base44.entities.InviteHistory.subscribe(() => {
      queryClient.invalidateQueries({ queryKey: ['inviteHistory'] });
      queryClient.refetchQueries({ queryKey: ['inviteHistory'] });
    });
    const unsubProfile = base44.entities.EmployeeProfile.subscribe(() => {
      queryClient.invalidateQueries({ queryKey: ['employeeProfiles'] });
      queryClient.refetchQueries({ queryKey: ['employeeProfiles'] });
    });
    return () => { unsubUser(); unsubInvite(); unsubProfile(); };
  }, [queryClient]);

  const activeEmployees = employeeProfiles.filter(p => p.status === 'active');
  const employees = allUsers.filter(u => u.portalRole === 'employee');
  const pendingInvites = invites.filter(i => i.status === 'pending' && i.portalRole === 'employee');
  const totalEmployeeInvites = invites.filter(i => i.portalRole === 'employee');

  const navigate = useNavigate();

  const employeeLinks = [
    { name: "Manage Employees", href: "AdminEmployees", icon: HardHat },
    { name: "Company News", href: "AdminNews", icon: Newspaper },
    { name: "Holiday Schedule", href: "AdminHolidays", icon: CalendarDays },
    { name: "JobTread Tutorials", href: "AdminJobTread", icon: BookOpen },
    { name: "Standards", href: "AdminStandards", icon: ClipboardList },
    { name: "Mobile Nav Order", icon: Smartphone, action: () => setShowMobileNav(!showMobileNav) },
    { name: "Quarterly Share Settings", icon: DollarSign, action: () => setShowBonusConfig(!showBonusConfig) },
  ];

  return (
    <AdminLayout title="Employee Portal Management">
      <div className="space-y-6">

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <StatCard label="Active Employees" value={activeEmployees.length} icon={HardHat} color="amber" />
          <StatCard label="Pending Invites" value={pendingInvites.length} icon={Send} color="violet" />
          <StatCard label="Total Invites Sent" value={totalEmployeeInvites.length} icon={History} color="emerald" />
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

        {/* Mood Tracker */}
        <MoodTracker />

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
              {showBonusConfig && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <BonusShareConfig />
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
    amber: 'text-amber-600',
    blue: 'text-blue-600',
    violet: 'text-violet-600',
    emerald: 'text-emerald-600',
  };
  return (
    <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-slate-100 bg-white">
      <Icon className={`w-4 h-4 ${colorMap[color]}`} />
      <span className="text-lg font-bold text-slate-900">{value}</span>
      <span className="text-xs text-slate-500">{label}</span>
    </div>
  );
}