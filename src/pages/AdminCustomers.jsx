import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import AdminLayout from '../components/admin/AdminLayout';
import CustomerList from '../components/admin/CustomerList';
import CustomerDetail from '../components/admin/CustomerDetail';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Users, UserPlus, RefreshCw } from 'lucide-react';
import InviteEmployeeDialog from '../components/admin/InviteEmployeeDialog';

export default function AdminCustomers() {
    const [selectedUser, setSelectedUser] = useState(null);
    const [search, setSearch] = useState('');
    const [inviteOpen, setInviteOpen] = useState(false);

    const { data: users = [], isLoading: usersLoading } = useQuery({
        queryKey: ['adminUsers'],
        queryFn: () => base44.entities.User.list(),
    });

    const { data: profiles = [], refetch: refetchProfiles } = useQuery({
        queryKey: ['adminCustomerProfiles'],
        queryFn: () => base44.entities.CustomerProfile.list(),
    });

    // Filter for customers
    const customers = users.filter(u => 
        u.role !== 'admin' && u.portalRole === 'customer'
    );

    const filteredCustomers = customers.filter(u => {
        const matchesSearch = !search || 
            u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
            u.email?.toLowerCase().includes(search.toLowerCase());
        return matchesSearch;
    });

    // Get the most up-to-date user object from the list
    const activeUser = selectedUser 
        ? customers.find(u => u.id === selectedUser.id) || selectedUser
        : null;

    const selectedProfile = activeUser 
        ? profiles.find(p => p.userEmail === activeUser.email) 
        : null;

    if (usersLoading) {
        return (
            <AdminLayout title="Customers">
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout title="Customers">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Customer List */}
                <div className="lg:col-span-4">
                    <div className="mb-4 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            placeholder="Search customers..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-slate-500" />
                            <span className="text-sm text-slate-500">{filteredCustomers.length} customer{filteredCustomers.length !== 1 ? 's' : ''}</span>
                        </div>
                        <Button size="sm" onClick={() => setInviteOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                            <UserPlus className="w-4 h-4 mr-1" /> Add Customer
                        </Button>
                    </div>
                    
                    <div className="max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
                        <CustomerList
                            users={filteredCustomers}
                            profiles={profiles}
                            onSelect={setSelectedUser}
                            selectedId={selectedUser?.id}
                        />
                    </div>
                </div>

                {/* Customer Detail */}
                <div className="lg:col-span-8">
                    <Card className="border-slate-200/60 shadow-sm min-h-[400px]">
                        <CardContent className="p-6">
                            <CustomerDetail 
                                user={activeUser} 
                                profile={selectedProfile} 
                                onDeleted={() => setSelectedUser(null)} 
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
            <InviteEmployeeDialog open={inviteOpen} onOpenChange={setInviteOpen} defaultRole="customer" />
        </AdminLayout>
    );
}