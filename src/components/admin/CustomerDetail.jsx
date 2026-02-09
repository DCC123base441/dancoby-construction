import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
    Phone, User, Mail, MapPin,
    Save, Trash2, Loader2, Eye
} from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function ProfileEditor({ profile, user }) {
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({});
    const queryClient = useQueryClient();

    const startEditing = () => {
        setForm({
            firstName: profile?.firstName || user.full_name?.split(' ')[0] || '',
            lastName: profile?.lastName || user.full_name?.split(' ').slice(1).join(' ') || '',
            phone: profile?.phone || '',
            address: profile?.address || '',
            bio: profile?.bio || '',
        });
        setEditing(true);
    };

    const saveMutation = useMutation({
        mutationFn: async (data) => {
            if (profile) {
                return base44.entities.CustomerProfile.update(profile.id, data);
            } else {
                return base44.entities.CustomerProfile.create({ ...data, userEmail: user.email });
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adminCustomerProfiles'] });
            setEditing(false);
            toast.success('Profile updated');
        },
    });

    if (editing) {
        return (
            <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-medium text-slate-500 mb-1 block">First Name</label>
                        <Input
                            value={form.firstName || ''}
                            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                            placeholder="First Name"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-medium text-slate-500 mb-1 block">Last Name</label>
                        <Input
                            value={form.lastName || ''}
                            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                            placeholder="Last Name"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-medium text-slate-500 mb-1 block">Phone</label>
                        <Input
                            value={form.phone || ''}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            placeholder="Phone"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-medium text-slate-500 mb-1 block">Address</label>
                        <Input
                            value={form.address || ''}
                            onChange={(e) => setForm({ ...form, address: e.target.value })}
                            placeholder="Address"
                        />
                    </div>
                    <div className="sm:col-span-2">
                        <label className="text-xs font-medium text-slate-500 mb-1 block">Bio / Notes</label>
                        <Textarea
                            value={form.bio || ''}
                            onChange={(e) => setForm({ ...form, bio: e.target.value })}
                            placeholder="Customer notes..."
                        />
                    </div>
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
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-slate-900">Customer Profile</h3>
                <Button variant="outline" size="sm" onClick={startEditing}>Edit Profile</Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-slate-50">
                        <User className="w-4 h-4 text-slate-500" />
                    </div>
                    <div>
                        <p className="text-xs text-slate-500">Full Name</p>
                        <p className="text-sm font-medium text-slate-900">
                            {profile?.firstName ? `${profile.firstName} ${profile.lastName}` : (user.full_name || '—')}
                        </p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-slate-50">
                        <Phone className="w-4 h-4 text-slate-500" />
                    </div>
                    <div>
                        <p className="text-xs text-slate-500">Phone</p>
                        <p className="text-sm font-medium text-slate-900">
                            {profile?.phone || '—'}
                        </p>
                    </div>
                </div>
                <div className="flex items-start gap-3 sm:col-span-2">
                    <div className="p-2 rounded-lg bg-slate-50">
                        <MapPin className="w-4 h-4 text-slate-500" />
                    </div>
                    <div>
                        <p className="text-xs text-slate-500">Address</p>
                        <p className="text-sm font-medium text-slate-900">
                            {profile?.address || '—'}
                        </p>
                    </div>
                </div>
                {profile?.bio && (
                    <div className="sm:col-span-2 p-4 bg-slate-50 rounded-lg text-sm text-slate-700">
                        <p className="font-medium text-xs text-slate-500 mb-1">Notes</p>
                        {profile.bio}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function CustomerDetail({ user, profile, onDeleted }) {
    const [deleting, setDeleting] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const queryClient = useQueryClient();

    React.useEffect(() => {
        base44.auth.me().then(setCurrentUser).catch(() => {});
    }, []);

    const updateRoleMutation = useMutation({
        mutationFn: (newRole) => base44.entities.User.update(user.id, { portalRole: newRole }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
            toast.success('Portal role updated');
        },
        onError: () => {
            toast.error('Failed to update role');
        }
    });

    const handleDelete = async () => {
        setDeleting(true);
        try {
            // Delete the user using a backend function if needed, or update role to none?
            // For now assuming deleteEmployee function works for any user
            await base44.functions.invoke('deleteEmployee', {
                userId: user.id,
                userEmail: user.email,
            });
            
            toast.success(`${user.full_name || user.email} has been removed`);
            queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
            queryClient.invalidateQueries({ queryKey: ['adminCustomerProfiles'] });
            setConfirmOpen(false);
            onDeleted?.();
        } catch (err) {
            toast.error(err?.response?.data?.error || err?.message || 'Failed to delete customer');
        }
        setDeleting(false);
    };

    if (!user) {
        return (
            <div className="flex items-center justify-center h-full text-slate-400 py-20">
                <div className="text-center">
                    <User className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                    <p className="text-sm">Select a customer to view details</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
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
                        
                        <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs font-medium text-slate-500">Role:</span>
                            <Select 
                                value={user.portalRole || 'none'} 
                                onValueChange={(val) => updateRoleMutation.mutate(val)}
                                disabled={updateRoleMutation.isPending}
                            >
                                <SelectTrigger className="h-7 w-[130px] text-xs border-slate-200 bg-white">
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">None</SelectItem>
                                    <SelectItem value="employee">Employee</SelectItem>
                                    <SelectItem value="customer">Customer</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
                
                <div className="flex flex-col gap-2 items-end">
                    <Link to={`${createPageUrl('AdminPortalPreview')}?type=customer&customer_email=${encodeURIComponent(user.email)}`}>
                        <Button variant="outline" size="sm" className="gap-1.5 text-xs text-blue-700 border-blue-200 hover:bg-blue-50">
                            <Eye className="w-3.5 h-3.5" /> View Portal
                        </Button>
                    </Link>

                    {currentUser?.id !== user.id && (
                        <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-600 hover:bg-red-50 text-xs">
                                    <Trash2 className="w-3.5 h-3.5 mr-1" /> Remove
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Remove Customer</AlertDialogTitle>
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
                    )}
                </div>
            </div>

            <ProfileEditor profile={profile} user={user} />
        </div>
    );
}