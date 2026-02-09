import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import { Button } from "@/components/ui/button";
import { ArrowLeft, HardHat, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import EmployeePortalInner from '../components/portal/EmployeePortalInner.jsx';
import ManagerPortalInner from '../components/portal/ManagerPortalInner.jsx';
import CustomerPortalContent from '../components/portal/CustomerPortalInner.jsx';
import { LanguageProvider } from '../components/portal/LanguageContext';

export default function AdminPortalPreview() {
    const urlParams = new URLSearchParams(window.location.search);
    const portalType = urlParams.get('type') || 'employee';
    const initialEmail = urlParams.get('employee_email') || '';

    const [selectedEmail, setSelectedEmail] = useState(initialEmail);

    const { data: profiles = [] } = useQuery({
        queryKey: ['adminProfiles'],
        queryFn: () => base44.entities.EmployeeProfile.list(),
    });

    const { data: users = [] } = useQuery({
        queryKey: ['adminUsers'],
        queryFn: () => base44.entities.User.list(),
    });

    // Build employee list from profiles (source of truth for employees)
    const profileEmails = new Set(profiles.map(p => p.userEmail));
    
    const employeeOptions = profiles.map(p => {
        const matchedUser = users.find(u => u.email === p.userEmail);
        return {
            email: p.userEmail || p.email,
            name: [p.firstName, p.lastName].filter(Boolean).join(' ') || matchedUser?.full_name || p.userEmail || p.email,
            pending: !matchedUser,
        };
    });

    // Auto-select first if none chosen
    useEffect(() => {
        if (!selectedEmail && employeeOptions.length > 0 && (portalType === 'employee' || portalType === 'manager')) {
            setSelectedEmail(employeeOptions[0].email);
        }
    }, [employeeOptions, selectedEmail, portalType]);

    const isEmployee = portalType === 'employee';
    const isManager = portalType === 'manager';
    const selectedProfile = profiles.find(p => p.userEmail === selectedEmail);

    // Build a fake user object for the portal preview
    const previewUser = selectedEmail ? {
        full_name: selectedProfile
            ? [selectedProfile.firstName, selectedProfile.lastName].filter(Boolean).join(' ')
            : employeeOptions.find(e => e.email === selectedEmail)?.name || selectedEmail,
        email: selectedEmail,
        role: 'user',
        portalRole: isManager ? 'manager' : 'employee',
        _adminPreview: true,
    } : null;

    return (
        <AdminLayout
            title={isEmployee ? "Employee Portal Preview" : isManager ? "Manager Portal Preview" : "Customer Portal Preview"}
            actions={
                <div className="flex items-center gap-3">
                    {(isEmployee || isManager) && (
                        <Select value={selectedEmail} onValueChange={setSelectedEmail}>
                            <SelectTrigger className="w-[220px] h-9 text-sm">
                                <SelectValue placeholder="Select person..." />
                            </SelectTrigger>
                            <SelectContent>
                                {employeeOptions.map(emp => (
                                    <SelectItem key={emp.email} value={emp.email}>
                                        {emp.name} {emp.pending ? '(Pending)' : ''}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                    <Button variant="outline" size="sm" asChild>
                        <Link to={createPageUrl('AdminDashboard')}>
                            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
                        </Link>
                    </Button>
                </div>
            }
        >
            {/* Preview banner */}
            <div className={`rounded-lg px-4 py-2.5 mb-6 flex items-center gap-2 text-sm ${
                isEmployee ? 'bg-amber-50 border border-amber-200 text-amber-800' :
                isManager ? 'bg-blue-50 border border-blue-200 text-blue-800' :
                'bg-green-50 border border-green-200 text-green-800'
            }`}>
                {isEmployee ? <HardHat className="w-4 h-4" /> : isManager ? <Users className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                <span className="font-medium">Preview Mode</span>
                <span className={isEmployee ? 'text-amber-600' : isManager ? 'text-blue-600' : 'text-green-600'}>
                    — Viewing {isEmployee ? 'employee' : isManager ? 'manager' : 'customer'} portal
                    {previewUser ? ` as ${previewUser.full_name || previewUser.email}` : ''}
                </span>
            </div>

            {/* Embedded portal */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[600px]">
                {isEmployee ? (
                    previewUser ? (
                        <LanguageProvider>
                            <EmployeePortalInner key={previewUser.email} user={previewUser} />
                        </LanguageProvider>
                    ) : (
                        <div className="flex items-center justify-center py-20 text-slate-400 text-sm">
                            Select an employee to preview their portal
                        </div>
                    )
                ) : isManager ? (
                    previewUser ? (
                        <LanguageProvider>
                            <ManagerPortalInner key={previewUser.email} user={previewUser} />
                        </LanguageProvider>
                    ) : (
                        <div className="flex items-center justify-center py-20 text-slate-400 text-sm">
                            Select a manager to preview their portal
                        </div>
                    )
                ) : (
                    <CustomerPortalContent />
                )}
            </div>
        </AdminLayout>
    );
}