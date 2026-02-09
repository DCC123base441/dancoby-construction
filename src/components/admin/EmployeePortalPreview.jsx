import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DollarSign, Calendar, Clock, MessageSquare, TrendingUp,
  Newspaper, CalendarDays, ShoppingBag, Briefcase, Phone, User, Mail
} from 'lucide-react';

function InfoRow({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="p-1.5 rounded-md bg-slate-50">
        <Icon className="w-3.5 h-3.5 text-slate-500" />
      </div>
      <div>
        <p className="text-[11px] text-slate-400">{label}</p>
        <p className="text-sm font-medium text-slate-800">{value}</p>
      </div>
    </div>
  );
}

function PortalProfileCard({ profile, user }) {
  const firstName = profile?.firstName || user?.full_name?.split(' ')[0] || 'Employee';
  const lastName = profile?.lastName || '';

  return (
    <Card className="border-slate-200">
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-4">
          {profile?.profilePicture ? (
            <img src={profile.profilePicture} alt="" className="w-12 h-12 rounded-full object-cover border" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-lg font-bold">
              {(firstName[0] || '') + (lastName[0] || '')}
            </div>
          )}
          <div>
            <p className="font-semibold text-slate-900">{firstName} {lastName}</p>
            <p className="text-xs text-slate-500">{profile?.position || 'No position'}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-4">
          <InfoRow icon={Mail} label="Email" value={profile?.email || user?.email} />
          <InfoRow icon={Briefcase} label="Department" value={profile?.department} />
          <InfoRow icon={Phone} label="Phone" value={profile?.phone} />
          <InfoRow icon={DollarSign} label="Hourly Wage" value={profile?.hourlySalary ? `$${profile.hourlySalary}/hr` : null} />
          <InfoRow icon={Calendar} label="Start Date" value={profile?.startDate ? new Date(profile.startDate).toLocaleDateString() : null} />
          <InfoRow icon={User} label="Emergency Contact" value={profile?.emergencyContactName} />
        </div>
      </CardContent>
    </Card>
  );
}

function PortalTimeOff({ userEmail }) {
  const { data: requests = [] } = useQuery({
    queryKey: ['portalPreviewTimeOff', userEmail],
    queryFn: () => base44.entities.TimeOffRequest.filter({ userEmail }),
  });

  const statusColors = {
    pending: 'bg-amber-100 text-amber-700',
    approved: 'bg-green-100 text-green-700',
    denied: 'bg-red-100 text-red-700',
  };

  return (
    <div className="space-y-2">
      {requests.length === 0 && <p className="text-sm text-slate-400 py-4 text-center">No time off requests</p>}
      {requests.map(r => (
        <div key={r.id} className="p-3 rounded-lg border border-slate-100 bg-white flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-800">
              {new Date(r.startDate).toLocaleDateString()} — {new Date(r.endDate).toLocaleDateString()}
            </p>
            <p className="text-xs text-slate-500 capitalize">{r.reason}</p>
          </div>
          <Badge className={`text-xs ${statusColors[r.status] || 'bg-slate-100 text-slate-600'}`}>{r.status}</Badge>
        </div>
      ))}
    </div>
  );
}

function PortalFeedback({ userEmail }) {
  const { data: feedback = [] } = useQuery({
    queryKey: ['portalPreviewFeedback', userEmail],
    queryFn: () => base44.entities.EmployeeFeedback.filter({ userEmail }),
  });

  return (
    <div className="space-y-2">
      {feedback.length === 0 && <p className="text-sm text-slate-400 py-4 text-center">No feedback submitted</p>}
      {feedback.map(f => (
        <div key={f.id} className={`p-3 rounded-lg border bg-white ${f.resolved ? 'border-green-200' : 'border-slate-100'}`}>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-xs capitalize">{f.category}</Badge>
            {f.isAnonymous && <Badge className="text-xs bg-slate-100 text-slate-600">Anonymous</Badge>}
            {f.resolved && <Badge className="text-xs bg-green-100 text-green-700">Resolved</Badge>}
          </div>
          <p className="text-sm text-slate-700">{f.content}</p>
          <p className="text-[11px] text-slate-400 mt-1">{new Date(f.created_date).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
}

function PortalRaises({ userEmail }) {
  const { data: requests = [] } = useQuery({
    queryKey: ['portalPreviewRaises', userEmail],
    queryFn: () => base44.entities.RaiseRequest.filter({ userEmail }),
  });

  const statusColors = {
    pending: 'bg-amber-100 text-amber-700',
    approved: 'bg-green-100 text-green-700',
    denied: 'bg-red-100 text-red-700',
    scheduled: 'bg-blue-100 text-blue-700',
  };

  return (
    <div className="space-y-2">
      {requests.length === 0 && <p className="text-sm text-slate-400 py-4 text-center">No raise/review requests</p>}
      {requests.map(r => (
        <div key={r.id} className="p-3 rounded-lg border border-slate-100 bg-white">
          <div className="flex items-center gap-2 mb-1">
            <Badge className={`text-xs ${statusColors[r.status] || ''}`}>{r.status}</Badge>
            <Badge variant="outline" className="text-xs capitalize">{r.requestType}</Badge>
          </div>
          {r.currentRate && <p className="text-xs text-slate-500">Current: ${r.currentRate}/hr</p>}
          {r.requestedRate && <p className="text-xs text-slate-500">Requested: ${r.requestedRate}/hr</p>}
          <p className="text-sm text-slate-700 mt-1">{r.reason}</p>
        </div>
      ))}
    </div>
  );
}

export default function EmployeePortalPreview({ user, profile }) {
  const firstName = profile?.firstName || user?.full_name?.split(' ')[0] || 'Employee';
  const email = user?.email;

  return (
    <div className="space-y-4">
      {/* Simulated portal header */}
      <div className="rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 p-4 text-white">
        <p className="text-amber-100 text-[11px] font-medium uppercase tracking-wider mb-1">Employee Portal Preview</p>
        <h2 className="text-lg font-bold">Welcome, {firstName}</h2>
        <p className="text-amber-100 text-xs mt-0.5">{profile?.position || 'Team Member'} {profile?.department ? `· ${profile.department}` : ''}</p>
      </div>

      <PortalProfileCard profile={profile} user={user} />

      <Tabs defaultValue="timeoff" className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="timeoff" className="text-xs gap-1"><Clock className="w-3.5 h-3.5" /> Time Off</TabsTrigger>
          <TabsTrigger value="feedback" className="text-xs gap-1"><MessageSquare className="w-3.5 h-3.5" /> Feedback</TabsTrigger>
          <TabsTrigger value="raises" className="text-xs gap-1"><TrendingUp className="w-3.5 h-3.5" /> Raises</TabsTrigger>
        </TabsList>
        <TabsContent value="timeoff">
          <PortalTimeOff userEmail={email} />
        </TabsContent>
        <TabsContent value="feedback">
          <PortalFeedback userEmail={email} />
        </TabsContent>
        <TabsContent value="raises">
          <PortalRaises userEmail={email} />
        </TabsContent>
      </Tabs>
    </div>
  );
}