import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import AdminLayout from '../components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HardHat, Users, Calendar, ExternalLink, ChevronRight } from 'lucide-react';

export default function AdminPortals() {
    const portalLinks = [
        {
            title: "Employee Portal",
            description: "Manage employee profiles, news, feedback, time off, and more",
            icon: HardHat,
            color: "bg-amber-50 text-amber-600",
            href: "EmployeePortal",
            adminPages: [
                { name: "Manage Employees", href: "AdminEmployees" },
                { name: "Company News", href: "AdminNews" },
                { name: "Holiday Schedule", href: "AdminHolidays" },
                { name: "JobTread Tutorials", href: "AdminJobTread" },
            ]
        },
        {
            title: "Customer Portal",
            description: "Customer project tracking and communication hub",
            icon: Users,
            color: "bg-blue-50 text-blue-600",
            href: "CustomerPortal",
            adminPages: []
        },
    ];

    return (
        <AdminLayout title="Portals">
            <div className="space-y-8">
                <p className="text-slate-500">Manage employee and customer portals, holidays, and related settings.</p>

                <div className="grid gap-6 md:grid-cols-2">
                    {portalLinks.map((portal) => (
                        <Card key={portal.title} className="border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div className={`p-3 rounded-xl ${portal.color}`}>
                                        <portal.icon className="w-6 h-6" />
                                    </div>
                                    <Link to={createPageUrl(portal.href)} target="_blank">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600">
                                            <ExternalLink className="w-4 h-4" />
                                        </Button>
                                    </Link>
                                </div>
                                <CardTitle className="text-lg mt-3">{portal.title}</CardTitle>
                                <CardDescription className="text-sm">{portal.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="space-y-2">
                                    {portal.adminPages.length > 0 && (
                                        <div className="border-t border-slate-100 pt-3 space-y-1">
                                            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Quick Links</p>
                                            {portal.adminPages.map((page) => (
                                                <Link 
                                                    key={page.name}
                                                    to={createPageUrl(page.href)}
                                                    className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-50 text-sm text-slate-600 hover:text-slate-900 transition-colors"
                                                >
                                                    {page.name}
                                                    <ChevronRight className="w-4 h-4 text-slate-300" />
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                    {portal.adminPages.length === 0 && (
                                        <Link to={createPageUrl(portal.href)}>
                                            <Button variant="outline" className="w-full" size="sm">
                                                Open {portal.title}
                                                <ChevronRight className="w-4 h-4 ml-1" />
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Holiday Schedule */}
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-green-50 text-green-600">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-semibold text-slate-900">Holiday Schedule</h2>
                    </div>
                    <HolidayManager />
                </div>
            </div>
        </AdminLayout>
    );
}