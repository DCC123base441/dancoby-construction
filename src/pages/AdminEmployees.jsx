import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import AdminLayout from '../components/admin/AdminLayout';
import EmployeeList from '../components/admin/EmployeeList';
import EmployeeDetail from '../components/admin/EmployeeDetail';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Users } from 'lucide-react';

export default function AdminEmployees() {
    const [selectedUser, setSelectedUser] = useState(null);
    const [search, setSearch] = useState('');

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
                    <div className="flex items-center gap-2 mb-3">
                        <Users className="w-4 h-4 text-slate-500" />
                        <span className="text-sm text-slate-500">{employees.length} employee{employees.length !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
                        <EmployeeList
                            users={employees}
                            profiles={profiles}
                            onSelect={setSelectedUser}
                            selectedId={selectedUser?.id}
                        />
                    </div>
                </div>

                {/* Employee Detail */}
                <div className="lg:col-span-8">
                    <Card className="border-slate-200/60 shadow-sm min-h-[400px]">
                        <CardContent className="p-6">
                            <EmployeeDetail user={selectedUser} profile={selectedProfile} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}