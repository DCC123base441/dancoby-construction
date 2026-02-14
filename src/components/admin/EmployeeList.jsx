import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Calendar, Briefcase, Clock } from 'lucide-react';

export default function EmployeeList({ users, profiles, invites = [], onSelect, selectedId }) {
    const getProfile = (email) => profiles.find(p => p.userEmail?.toLowerCase() === email?.toLowerCase());
    // Check if invite is still pending by looking at InviteHistory status directly
    const isInvitePending = (email) => {
        const inv = invites.find(i => i.email?.toLowerCase() === email?.toLowerCase());
        return inv ? inv.status === 'pending' : false;
    };

    const toTitleCase = (str) => {
        if (!str) return '';
        return str.toLowerCase().split(/[\s._-]+/).filter(Boolean).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    };

    const getDisplayName = (user) => {
        const profile = getProfile(user.email);
        if (profile?.firstName || profile?.lastName) {
            return toTitleCase([profile.firstName, profile.lastName].filter(Boolean).join(' '));
        }
        const n = user.full_name?.trim();
        if (n) {
            if (n.includes(',')) {
                const [last, first] = n.split(',').map(s => s.trim());
                return toTitleCase(`${first} ${last}`);
            }
            return toTitleCase(n);
        }
        return toTitleCase(user.email?.split('@')[0] || 'Unknown');
    };

    const getInitials = (user) => {
        const profile = getProfile(user.email);
        if (profile?.firstName && profile?.lastName) {
            return `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`.toUpperCase();
        }
        if (profile?.firstName) return profile.firstName.substring(0, 2).toUpperCase();
        const name = getDisplayName(user);
        const parts = name.split(' ').filter(Boolean);
        if (parts.length >= 2) return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
        return name.substring(0, 2).toUpperCase();
    };

    return (
        <div className="space-y-2">
            {users.map((user) => {
                const profile = getProfile(user.email);
                const isSelected = selectedId === user.id;
                // Pending = either a synthetic pending-profile entry OR a real user whose invite is still pending
                const isPending = String(user.id).startsWith('pending-') || isInvitePending(user.email);
                return (
                    <Card
                        key={user.id}
                        className={`cursor-pointer transition-all border ${
                            isSelected 
                                ? 'border-red-500 bg-red-50/50 shadow-md' 
                                : isPending
                                    ? 'border-amber-200 bg-amber-50/30 hover:border-amber-300 hover:shadow-sm'
                                    : 'border-slate-200/60 hover:border-slate-300 hover:shadow-sm'
                        }`}
                        onClick={() => onSelect(user)}
                    >
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10 border border-slate-200">
                                    <AvatarFallback className={`text-sm font-semibold ${isPending ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'}`}>
                                        {(user.full_name || user.email)?.substring(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-slate-900 truncate">{user.full_name ? user.full_name.split(' ').filter(Boolean).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ') : 'No Name'}</p>
                                    <p className="text-xs text-slate-500 truncate select-text">{user.email}</p>
                                </div>
                                {isPending ? (
                                    <Badge className="text-xs shrink-0 bg-amber-100 text-amber-700 border-amber-200">
                                        <Clock className="w-3 h-3 mr-1" /> Pending
                                    </Badge>
                                ) : (
                                    <Badge variant="outline" className="text-xs capitalize shrink-0">
                                        {user.role}
                                    </Badge>
                                )}
                            </div>
                            {profile && (
                                <div className="flex flex-wrap gap-3 mt-3 text-xs text-slate-500">
                                    {profile.isJobTreadConnected && (
                                        <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                                            <div className="relative flex items-center justify-center w-3.5 h-3.5">
                                                <div className="absolute inset-0 rounded-full border border-emerald-400 shadow-[0_0_4px_rgba(52,211,153,0.4)]" />
                                                <img 
                                                    src="https://yt3.ggpht.com/QWox277KuhTRFhCWHnkwLJKwYyY-pIZopKYRWhFhdsggxm9Z7BFfy3VlgyEJxYdXbyNbwjdQYz4=s68-c-k-c0x00ffffff-no-rj" 
                                                    alt="JobTread" 
                                                    className="w-full h-full rounded-full" 
                                                />
                                            </div>
                                            <span className="font-medium">JobTread Connected</span>
                                        </div>
                                    )}
                                    {profile.position && (
                                        <span className="flex items-center gap-1">
                                            <Briefcase className="w-3 h-3" /> {profile.position}
                                        </span>
                                    )}
                                    {profile.hourlySalary && (
                                        <span className="flex items-center gap-1">
                                            <DollarSign className="w-3 h-3" /> ${profile.hourlySalary}/hr
                                        </span>
                                    )}
                                    {profile.startDate && (
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" /> {new Date(profile.startDate).toLocaleDateString()}
                                        </span>
                                    )}
                                </div>
                            )}
                            {!profile && !isPending && (
                                <p className="text-xs text-amber-600 mt-2">No profile set up yet</p>
                            )}
                        </CardContent>
                    </Card>
                );
            })}
            {users.length === 0 && (
                <div className="text-center py-12 text-slate-400">
                    <p>No employees found.</p>
                </div>
            )}
        </div>
    );
}