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

import EmployeePortalInner from '../components/portal/EmployeePortalInner';
import CustomerPortalContent from '../components/portal/CustomerPortalInner';
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

    // Build employee list for the selector
    const employeeUsers = users.filter(u => u.portalRole === 'employee');
    const userEmails = new Set(employeeUsers.map(u => u.email));
    const pendingProfiles = profiles.filter(p => !userEmails.has(p.userEmail));

    const employeeOptions = [
        ...employeeUsers.map(u => ({
            email: u.email,
            name: u.full_name || u.email,
        })),
        ...pendingProfiles.map(p => ({
            email: p.userEmail || p.email,
            name: [p.firstName, p.lastName].filter(Boolean).join(' ') || p.userEmail || p.email,
            pending: true,
        })),
    ];

    // Auto-select first if none chosen
    useEffect(() => {
        if (!selectedEmail && employeeOptions.length > 0 && portalType === 'employee') {
            setSelectedEmail(employeeOptions[0].email);
        }
    }, [employeeOptions, selectedEmail, portalType]);

    const isEmployee = portalType === 'employee';
    const selectedProfile = profiles.find(p => p.userEmail === selectedEmail);

    // Build a fake user object for the portal preview
    const previewUser = selectedEmail ? {
        full_name: selectedProfile
            ? [selectedProfile.firstName, selectedProfile.lastName].filter(Boolean).join(' ')
            : employeeOptions.find(e => e.email === selectedEmail)?.name || selectedEmail,
        email: selectedEmail,
        role: 'user',
        portalRole: 'employee',
        _adminPreview: true,
    } : null;

    return (
        <AdminLayout
            title={isEmployee ? "Employee Portal Preview" : "Customer Portal Preview"}
            actions={
                <div className="flex items-center gap-3">
                    {isEmployee && (
                        <Select value={selectedEmail} onValueChange={setSelectedEmail}>
                            <SelectTrigger className="w-[220px] h-9 text-sm">
                                <SelectValue placeholder="Select employee..." />
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
            <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5 mb-6 flex items-center gap-2 text-sm text-amber-800">
                {isEmployee ? <HardHat className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                <span className="font-medium">Preview Mode</span>
                <span className="text-amber-600">
                    — Viewing {isEmployee ? 'employee' : 'customer'} portal
                    {previewUser ? ` as ${previewUser.full_name || previewUser.email}` : ''}
                </span>
            </div>

            {/* Embedded portal */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[600px]">
                {isEmployee ? (
                    previewUser ? (
                        <LanguageProvider>
                            <EmployeePortalInner user={previewUser} />
                        </LanguageProvider>
                    ) : (
                        <div className="flex items-center justify-center py-20 text-slate-400 text-sm">
                            Select an employee to preview their portal
                        </div>
                    )
                ) : (
                    <CustomerPortalContent />
                )}
            </div>
        </AdminLayout>
    );
}