import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HardHat, Users, ExternalLink, ChevronRight, Newspaper, CalendarDays, BookOpen } from 'lucide-react';

export default function DashboardPortalCards() {
    const { data: allUsers = [] } = useQuery({
        queryKey: ['portalUsers'],
        queryFn: () => base44.entities.User.list(),
    });

    const employees = allUsers.filter(u => u.portalRole === 'employee');
    const customers = allUsers.filter(u => u.portalRole === 'customer');

    const employeeLinks = [
        { name: "Manage Employees", href: "AdminEmployees", icon: HardHat },
        { name: "Company News", href: "AdminNews", icon: Newspaper },
        { name: "Holiday Schedule", href: "AdminHolidays", icon: CalendarDays },
        { name: "JobTread Tutorials", href: "AdminJobTread", icon: BookOpen },
    ];

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            {/* Employee Portal */}
            <Card className="border-slate-200/60 shadow-sm overflow-hidden">
                <div className="h-1.5 bg-gradient-to-r from-amber-400 to-amber-600" />
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-amber-50">
                                <HardHat className="w-5 h-5 text-amber-600" />
                            </div>
                            <div>
                                <CardTitle className="text-base">Employee Portal</CardTitle>
                                <p className="text-xs text-slate-500 mt-0.5">{employees.length} active employee{employees.length !== 1 ? 's' : ''}</p>
                            </div>
                        </div>
                        <Link to={createPageUrl('AdminPortalPreview') + '&type=employee'}>
                            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                                Open <ExternalLink className="w-3 h-3" />
                            </Button>
                        </Link>
                    </div>
                </CardHeader>
                <CardContent className="pt-2">
                    <div className="grid grid-cols-2 gap-2">
                        {employeeLinks.map((page) => (
                            <Link
                                key={page.name}
                                to={createPageUrl(page.href)}
                                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-amber-50 hover:border-amber-200 text-sm text-slate-700 hover:text-amber-800 transition-all group"
                            >
                                <page.icon className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition-colors" />
                                <span className="flex-1 truncate">{page.name}</span>
                                <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-amber-500 transition-colors" />
                            </Link>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Customer Portal */}
            <Card className="border-slate-200/60 shadow-sm overflow-hidden">
                <div className="h-1.5 bg-gradient-to-r from-blue-400 to-blue-600" />
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-blue-50">
                                <Users className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <CardTitle className="text-base">Customer Portal</CardTitle>
                                <p className="text-xs text-slate-500 mt-0.5">{customers.length} active customer{customers.length !== 1 ? 's' : ''}</p>
                            </div>
                        </div>
                        <Link to={createPageUrl('AdminPortalPreview') + '&type=customer'}>
                            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                                Open <ExternalLink className="w-3 h-3" />
                            </Button>
                        </Link>
                    </div>
                </CardHeader>
                <CardContent className="pt-2">
                    <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50/50 p-4 text-center">
                        <Users className="w-5 h-5 text-slate-300 mx-auto mb-2" />
                        <p className="text-xs text-slate-400">Customer management is done via project assignments.</p>
                        <Link to={createPageUrl('AdminProjects')}>
                            <Button variant="link" size="sm" className="text-xs text-blue-600 mt-1 px-0">
                                Go to Projects →
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}