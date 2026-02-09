import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import AdminLayout from '../components/admin/AdminLayout';
import EmployeeList from '../components/admin/EmployeeList';
import EmployeeDetail from '../components/admin/EmployeeDetail';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Users, UserPlus, History } from 'lucide-react';
import AddEmployeeDialog from '../components/admin/AddEmployeeDialog';
import InviteHistoryPanel from '../components/admin/InviteHistoryPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminEmployees() {
    const [selectedUser, setSelectedUser] = useState(null);
    const [search, setSearch] = useState('');
    const [inviteOpen, setInviteOpen] = useState(false);

    const { data: users = [], isLoading: usersLoading } = useQuery({
        queryKey: ['adminUsers'],
        queryFn: () => base44.entities.User.list(),
    });

    const { data: profiles = [] } = useQuery({
        queryKey: ['adminProfiles'],
        queryFn: () => base44.entities.EmployeeProfile.list(),
    });

    // Filter out admins to show only employees, and apply search
    const employees = users.filter(u => {
        const matchesSearch = !search || 
            u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
            u.email?.toLowerCase().includes(search.toLowerCase());
        return matchesSearch;
    });

    const selectedProfile = selectedUser 
        ? profiles.find(p => p.userEmail === selectedUser.email) 
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
                        <Button size="sm" onClick={() => setInviteOpen(true)} className="bg-amber-600 hover:bg-amber-700">
                            <UserPlus className="w-4 h-4 mr-1" /> Add Employee
                        </Button>
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
                                user={selectedUser} 
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