import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
    DollarSign, Briefcase, Calendar, Phone, User, Mail, 
    MessageSquare, Clock, TrendingUp, Save, AlertCircle,
    CheckCircle2, XCircle, Hourglass, Trash2, Loader2, Eye
} from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';

function ProfileTab({ profile, user, onProfileUpdate }) {
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({});
    const queryClient = useQueryClient();

    const startEditing = () => {
        setForm({
            position: profile?.position || '',
            department: profile?.department || '',
            phone: profile?.phone || '',
            hourlySalary: profile?.hourlySalary || '',
            startDate: profile?.startDate || '',
            emergencyContactName: profile?.emergencyContactName || '',
            emergencyContactPhone: profile?.emergencyContactPhone || '',
            bio: profile?.bio || '',
        });
        setEditing(true);
    };

    const saveMutation = useMutation({
        mutationFn: async (data) => {
            const cleaned = { ...data, hourlySalary: data.hourlySalary ? Number(data.hourlySalary) : undefined };
            if (profile) {
                return base44.entities.EmployeeProfile.update(profile.id, cleaned);
            } else {
                return base44.entities.EmployeeProfile.create({ ...cleaned, userEmail: user.email });
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adminProfiles'] });
            setEditing(false);
            toast.success('Profile updated');
        },
    });

    const fields = [
        { key: 'position', label: 'Position', icon: Briefcase },
        { key: 'department', label: 'Department', icon: User },
        { key: 'phone', label: 'Phone', icon: Phone },
        { key: 'hourlySalary', label: 'Hourly Wage ($)', icon: DollarSign, type: 'number' },
        { key: 'startDate', label: 'Start Date', icon: Calendar, type: 'date' },
        { key: 'emergencyContactName', label: 'Emergency Contact', icon: User },
        { key: 'emergencyContactPhone', label: 'Emergency Phone', icon: Phone },
        { key: 'bio', label: 'Bio', icon: MessageSquare },
    ];

    if (editing) {
        return (
            <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {fields.map(f => (
                        <div key={f.key}>
                            <label className="text-xs font-medium text-slate-500 mb-1 block">{f.label}</label>
                            <Input
                                type={f.type || 'text'}
                                value={form[f.key] || ''}
                                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                                placeholder={f.label}
                            />
                        </div>
                    ))}
                </div>
                <div className="flex gap-2">
                    <Button onClick={() => saveMutation.mutate(form)} disabled={saveMutation.isPending} className="bg-slate-900">
                        <Save className="w-4 h-4 mr-2" /> {saveMutation.isPending ? 'Saving...' : 'Save'}
                    </Button>
                    <Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Button variant="outline" size="sm" onClick={startEditing}>Edit Profile</Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {fields.map(f => (
                    <div key={f.key} className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-slate-50">
                            <f.icon className="w-4 h-4 text-slate-500" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500">{f.label}</p>
                            <p className="text-sm font-medium text-slate-900">
                                {f.key === 'hourlySalary' && profile?.[f.key] ? `$${profile[f.key]}` : (profile?.[f.key] || '—')}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            {profile?.skills?.length > 0 && (
                <div>
                    <p className="text-xs text-slate-500 mb-2">Skills</p>
                    <div className="flex flex-wrap gap-1">
                        {profile.skills.map((s, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">{s}</Badge>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

const statusColors = {
    pending: 'bg-amber-100 text-amber-800',
    approved: 'bg-green-100 text-green-800',
    denied: 'bg-red-100 text-red-800',
    scheduled: 'bg-blue-100 text-blue-800',
};

const statusIcons = {
    pending: Hourglass,
    approved: CheckCircle2,
    denied: XCircle,
    scheduled: Clock,
};

function TimeOffTab({ userEmail }) {
    const { data: requests = [] } = useQuery({
        queryKey: ['adminTimeOff', userEmail],
        queryFn: () => base44.entities.TimeOffRequest.filter({ userEmail }),
    });
    const queryClient = useQueryClient();
    const updateMutation = useMutation({
        mutationFn: ({ id, status }) => base44.entities.TimeOffRequest.update(id, { status }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adminTimeOff', userEmail] });
            toast.success('Time off request updated');
        },
    });

    if (requests.length === 0) return <p className="text-sm text-slate-400 py-4">No time off requests.</p>;

    return (
        <div className="space-y-3">
            {requests.map(r => {
                const Icon = statusIcons[r.status] || Hourglass;
                return (
                    <div key={r.id} className="p-3 rounded-lg border border-slate-200 bg-white">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <Badge className={`text-xs ${statusColors[r.status]}`}>{r.status}</Badge>
                                <Badge variant="outline" className="text-xs capitalize">{r.reason}</Badge>
                            </div>
                            {r.status === 'pending' && (
                                <div className="flex gap-1">
                                    <Button size="sm" variant="ghost" className="h-7 text-xs text-green-600 hover:bg-green-50"
                                        onClick={() => updateMutation.mutate({ id: r.id, status: 'approved' })}>
                                        Approve
                                    </Button>
                                    <Button size="sm" variant="ghost" className="h-7 text-xs text-red-600 hover:bg-red-50"
                                        onClick={() => updateMutation.mutate({ id: r.id, status: 'denied' })}>
                                        Deny
                                    </Button>
                                </div>
                            )}
                        </div>
                        <p className="text-sm text-slate-700">
                            {new Date(r.startDate).toLocaleDateString()} — {new Date(r.endDate).toLocaleDateString()}
                        </p>
                        {r.notes && <p className="text-xs text-slate-500 mt-1">{r.notes}</p>}
                    </div>
                );
            })}
        </div>
    );
}

function FeedbackTab({ userEmail }) {
    const queryClient = useQueryClient();
    const { data: feedback = [] } = useQuery({
        queryKey: ['adminFeedback', userEmail],
        queryFn: () => base44.entities.EmployeeFeedback.filter({ userEmail }),
    });
    const resolveMutation = useMutation({
        mutationFn: ({ id, resolved }) => base44.entities.EmployeeFeedback.update(id, { resolved }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adminFeedback', userEmail] });
            queryClient.invalidateQueries({ queryKey: ['recentFeedback'] });
            toast.success('Feedback updated');
        },
    });

    if (feedback.length === 0) return <p className="text-sm text-slate-400 py-4">No feedback submitted.</p>;

    return (
        <div className="space-y-3">
            {feedback.map(f => (
                <div key={f.id} className={`p-3 rounded-lg border bg-white ${f.resolved ? 'border-green-200 bg-green-50/30' : 'border-slate-200'}`}>
                    <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs capitalize">{f.category}</Badge>
                        {f.isAnonymous && <Badge className="text-xs bg-slate-100 text-slate-600">Anonymous</Badge>}
                        {f.resolved && <Badge className="text-xs bg-green-100 text-green-700">Resolved</Badge>}
                        <span className="text-xs text-slate-400 ml-auto">{new Date(f.created_date).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-slate-700">{f.content}</p>
                    <div className="mt-2 flex justify-end">
                        <Button
                            size="sm"
                            variant="ghost"
                            className={`h-7 text-xs ${f.resolved ? 'text-slate-500 hover:bg-slate-100' : 'text-green-600 hover:bg-green-50'}`}
                            onClick={() => resolveMutation.mutate({ id: f.id, resolved: !f.resolved })}
                            disabled={resolveMutation.isPending}
                        >
                            {f.resolved ? <XCircle className="w-3.5 h-3.5 mr-1" /> : <CheckCircle2 className="w-3.5 h-3.5 mr-1" />}
                            {f.resolved ? 'Unresolve' : 'Resolve'}
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
}

function RaiseTab({ userEmail }) {
    const { data: requests = [] } = useQuery({
        queryKey: ['adminRaises', userEmail],
        queryFn: () => base44.entities.RaiseRequest.filter({ userEmail }),
    });
    const queryClient = useQueryClient();
    const updateMutation = useMutation({
        mutationFn: ({ id, status }) => base44.entities.RaiseRequest.update(id, { status }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adminRaises', userEmail] });
            toast.success('Raise request updated');
        },
    });

    if (requests.length === 0) return <p className="text-sm text-slate-400 py-4">No raise/review requests.</p>;

    return (
        <div className="space-y-3">
            {requests.map(r => (
                <div key={r.id} className="p-3 rounded-lg border border-slate-200 bg-white">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <Badge className={`text-xs ${statusColors[r.status]}`}>{r.status}</Badge>
                            <Badge variant="outline" className="text-xs capitalize">{r.requestType}</Badge>
                        </div>
                        {r.status === 'pending' && (
                            <div className="flex gap-1">
                                <Button size="sm" variant="ghost" className="h-7 text-xs text-green-600 hover:bg-green-50"
                                    onClick={() => updateMutation.mutate({ id: r.id, status: 'approved' })}>
                                    Approve
                                </Button>
                                <Button size="sm" variant="ghost" className="h-7 text-xs text-red-600 hover:bg-red-50"
                                    onClick={() => updateMutation.mutate({ id: r.id, status: 'denied' })}>
                                    Deny
                                </Button>
                            </div>
                        )}
                    </div>
                    {r.currentRate && <p className="text-xs text-slate-500">Current: ${r.currentRate}/hr</p>}
                    {r.requestedRate && <p className="text-xs text-slate-500">Requested: ${r.requestedRate}/hr</p>}
                    <p className="text-sm text-slate-700 mt-1">{r.reason}</p>
                    <span className="text-xs text-slate-400">{new Date(r.created_date).toLocaleDateString()}</span>
                </div>
            ))}
        </div>
    );
}

export default function EmployeeDetail({ user, profile, onDeleted }) {
    const [deleting, setDeleting] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const queryClient = useQueryClient();

    const handleDelete = async () => {
        setDeleting(true);
        try {
            const isPending = user._isPending || String(user.id).startsWith('pending-');
            if (isPending) {
                // Only delete the profile for pending (not-yet-registered) employees
                if (profile) {
                    await base44.entities.EmployeeProfile.delete(profile.id);
                }
            } else {
                await base44.functions.invoke('deleteEmployee', {
                    userId: user.id,
                    userEmail: user.email,
                });
            }
            toast.success(`${user.full_name || user.email} has been removed`);
            queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
            queryClient.invalidateQueries({ queryKey: ['adminProfiles'] });
            setConfirmOpen(false);
            onDeleted?.();
        } catch (err) {
            toast.error(err?.response?.data?.error || err?.message || 'Failed to delete employee');
        }
        setDeleting(false);
    };

    if (!user) {
        return (
            <div className="flex items-center justify-center h-full text-slate-400 py-20">
                <div className="text-center">
                    <User className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                    <p className="text-sm">Select an employee to view details</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    {profile?.profilePicture ? (
                        <img src={profile.profilePicture} alt="" className="w-14 h-14 rounded-full object-cover border-2 border-slate-200" />
                    ) : (
                        <div className="w-14 h-14 rounded-full bg-slate-900 text-white flex items-center justify-center text-xl font-bold">
                            {(user.full_name || user.email)?.substring(0, 2).toUpperCase()}
                        </div>
                    )}
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">{user.full_name || 'No Name'}</h2>
                        <p className="text-sm text-slate-500 flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {profile?.email || user.email}</p>
                    </div>
                </div>
                <Link to={`${createPageUrl('AdminPortalPreview')}?type=employee&employee_email=${encodeURIComponent(user.email)}`}>
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs text-amber-700 border-amber-200 hover:bg-amber-50">
                        <Eye className="w-3.5 h-3.5" /> View Portal
                    </Button>
                </Link>
                <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                    <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-600 hover:bg-red-50">
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete Employee</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will permanently remove <strong>{user.full_name || user.email}</strong> and their profile. This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
                            <Button onClick={handleDelete} disabled={deleting} className="bg-red-600 hover:bg-red-700">
                                {deleting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />}
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>

            <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid grid-cols-4 w-full mb-4">
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="timeoff">Time Off</TabsTrigger>
                    <TabsTrigger value="feedback">Feedback</TabsTrigger>
                    <TabsTrigger value="raises">Raises</TabsTrigger>
                </TabsList>
                <TabsContent value="profile">
                    <ProfileTab profile={profile} user={user} />
                </TabsContent>
                <TabsContent value="timeoff">
                    <TimeOffTab userEmail={user.email} />
                </TabsContent>
                <TabsContent value="feedback">
                    <FeedbackTab userEmail={user.email} />
                </TabsContent>
                <TabsContent value="raises">
                    <RaiseTab userEmail={user.email} />
                </TabsContent>
            </Tabs>
        </div>
    );
}