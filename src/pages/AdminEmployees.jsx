import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import AdminLayout from '../components/admin/AdminLayout';
import EmployeeList from '../components/admin/EmployeeList';
import EmployeeDetail from '../components/admin/EmployeeDetail';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Users, UserPlus, History, RefreshCw } from 'lucide-react';
import { toast } from "sonner";
import AddEmployeeDialog from '../components/admin/AddEmployeeDialog';
import InviteHistoryPanel from '../components/admin/InviteHistoryPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminEmployees() {
    const [selectedUser, setSelectedUser] = useState(null);
    const [search, setSearch] = useState('');
    const [inviteOpen, setInviteOpen] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const queryClient = useQueryClient();

    const { data: users = [], isLoading: usersLoading, refetch: refetchUsers } = useQuery({
        queryKey: ['adminUsers'],
        queryFn: () => base44.entities.User.list(),
    });

    const { data: profiles = [], refetch: refetchProfiles } = useQuery({
        queryKey: ['adminProfiles'],
        queryFn: () => base44.entities.EmployeeProfile.list(),
    });

    const { data: invites = [] } = useQuery({
        queryKey: ['adminInvites'],
        queryFn: () => base44.entities.InviteHistory.list('-created_date', 100),
    });

    // Real-time subscriptions for live updates across browsers
    useEffect(() => {
        const unsubUser = base44.entities.User.subscribe(() => {
            queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
            queryClient.refetchQueries({ queryKey: ['adminUsers'] });
        });
        const unsubProfile = base44.entities.EmployeeProfile.subscribe(() => {
            queryClient.invalidateQueries({ queryKey: ['adminProfiles'] });
            queryClient.refetchQueries({ queryKey: ['adminProfiles'] });
        });
        const unsubInvite = base44.entities.InviteHistory.subscribe(() => {
            queryClient.invalidateQueries({ queryKey: ['inviteHistory'] });
            queryClient.refetchQueries({ queryKey: ['inviteHistory'] });
            queryClient.invalidateQueries({ queryKey: ['adminInvites'] });
            queryClient.refetchQueries({ queryKey: ['adminInvites'] });
            // When invite status changes, user/profile data may also have changed
            queryClient.refetchQueries({ queryKey: ['adminUsers'] });
            queryClient.refetchQueries({ queryKey: ['adminProfiles'] });
        });
        return () => { unsubUser(); unsubProfile(); unsubInvite(); };
    }, [queryClient]);

    const handleSyncJobTread = async () => {
        setIsSyncing(true);
        try {
            const { data } = await base44.functions.invoke('syncJobTreadEmployees');
            if (data.success) {
                toast.success(`Synced ${data.count} employees from JobTread`);
                refetchProfiles();
            } else {
                toast.error('Sync failed', { description: data.error });
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to sync with JobTread');
        } finally {
            setIsSyncing(false);
        }
    };

    // Build a combined employee list from users + profiles (for invited-but-not-yet-accepted)
    const userEmails = new Set(users.map(u => u.email?.toLowerCase()));
    
    // Only show as pending if their invite is actually still pending
    const pendingProfiles = profiles.filter(p => {
        const email = (p.userEmail || p.email)?.toLowerCase();
        if (userEmails.has(email)) return false; // Already a real user
        // Check if their invite is still pending
        const inv = invites.find(i => i.email?.toLowerCase() === email);
        return !inv || inv.status === 'pending'; // Show if no invite found or invite is pending
    });
    
    // Convert pending profiles to user-like objects for the list
    const pendingAsUsers = pendingProfiles.map(p => ({
        id: `pending-${p.id}`,
        email: p.userEmail || p.email,
        full_name: [p.firstName, p.lastName].filter(Boolean).join(' ') || null,
        role: 'pending',
        _isPending: true,
    }));

    // Filter out users who are not relevant (random signups without roles or profiles)
    // Also filtering out admins as they are managed via dashboard access and don't need to be in the employee list
    const validUsers = users.filter(u => 
        u.role !== 'admin' && (
            u.portalRole === 'employee' || 
            u.portalRole === 'customer' ||
            profiles.some(p => p.userEmail?.toLowerCase() === u.email?.toLowerCase()) ||
            invites.some(i => i.email?.toLowerCase() === u.email?.toLowerCase() && i.status === 'accepted')
        )
    );

    const allEmployees = [...validUsers, ...pendingAsUsers];

    const employees = allEmployees.filter(u => {
        const matchesSearch = !search || 
            u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
            u.email?.toLowerCase().includes(search.toLowerCase());
        return matchesSearch;
    });

    // Get the most up-to-date user object from the list
    const activeUser = selectedUser 
        ? allEmployees.find(u => u.id === selectedUser.id) || selectedUser
        : null;

    const selectedProfile = activeUser 
        ? profiles.find(p => p.userEmail === activeUser.email) 
        : null;

    if (usersLoading) {
        return (
            <AdminLayout title="Employees">
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout title="Employees">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Employee List */}
                <div className="lg:col-span-4">
                    <div className="mb-4 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            placeholder="Search employees..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-slate-500" />
                            <span className="text-sm text-slate-500">{employees.length} employee{employees.length !== 1 ? 's' : ''}</span>
                        </div>
                        <div className="flex gap-2">
                            <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={handleSyncJobTread} 
                                disabled={isSyncing}
                                className="border-amber-200 hover:bg-amber-50 text-amber-700"
                            >
                                <RefreshCw className={`w-3.5 h-3.5 mr-1 ${isSyncing ? 'animate-spin' : ''}`} /> 
                                {isSyncing ? 'Syncing...' : 'Sync JobTread'}
                            </Button>
                            <Button size="sm" onClick={() => setInviteOpen(true)} className="bg-amber-600 hover:bg-amber-700">
                                <UserPlus className="w-4 h-4 mr-1" /> Add Employee
                            </Button>
                        </div>
                    </div>
                    <Tabs defaultValue="employees" className="w-full">
                        <TabsList className="grid grid-cols-2 w-full mb-3">
                            <TabsTrigger value="employees">
                                <Users className="w-3.5 h-3.5 mr-1.5" /> Team
                            </TabsTrigger>
                            <TabsTrigger value="invites">
                                <History className="w-3.5 h-3.5 mr-1.5" /> Invites
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="employees">
                            <div className="max-h-[calc(100vh-340px)] overflow-y-auto pr-1">
                                <EmployeeList
                                    users={employees}
                                    profiles={profiles}
                                    invites={invites}
                                    onSelect={setSelectedUser}
                                    selectedId={selectedUser?.id}
                                />
                            </div>
                        </TabsContent>
                        <TabsContent value="invites">
                            <div className="max-h-[calc(100vh-340px)] overflow-y-auto pr-1">
                                <InviteHistoryPanel users={users} />
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Employee Detail */}
                <div className="lg:col-span-8">
                    <Card className="border-slate-200/60 shadow-sm min-h-[400px]">
                        <CardContent className="p-6">
                            <EmployeeDetail 
                                user={activeUser} 
                                profile={selectedProfile} 
                                onDeleted={() => setSelectedUser(null)} 
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
            <AddEmployeeDialog open={inviteOpen} onOpenChange={setInviteOpen} />
        </AdminLayout>
    );
}