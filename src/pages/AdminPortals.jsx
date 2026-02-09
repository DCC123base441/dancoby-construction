import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import AdminLayout from '../components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HardHat, Users, ExternalLink, ChevronRight, ArrowRight } from 'lucide-react';

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

                <div className="grid grid-cols-2 gap-3">
                    <Link
                        to={createPageUrl("EmployeePortal") + "?admin_view=true"}
                        target="_blank"
                        className="group relative overflow-hidden rounded-xl border border-slate-200/80 bg-white p-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="relative z-10">
                            <div className="w-10 h-10 rounded-lg bg-orange-500/20 group-hover:bg-white/20 flex items-center justify-center mb-3 transition-colors">
                                <HardHat className="w-5 h-5 text-slate-700 group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="font-semibold text-sm text-slate-900 group-hover:text-white transition-colors">View as Employee</h3>
                            <p className="text-xs text-slate-500 group-hover:text-white/70 mt-0.5 transition-colors">Preview employee portal</p>
                            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-white absolute top-4 right-0 opacity-0 group-hover:opacity-100 transition-all translate-x-1 group-hover:translate-x-0" />
                        </div>
                    </Link>
                    <Link
                        to={createPageUrl("CustomerPortal")}
                        target="_blank"
                        className="group relative overflow-hidden rounded-xl border border-slate-200/80 bg-white p-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="relative z-10">
                            <div className="w-10 h-10 rounded-lg bg-cyan-500/20 group-hover:bg-white/20 flex items-center justify-center mb-3 transition-colors">
                                <Users className="w-5 h-5 text-slate-700 group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="font-semibold text-sm text-slate-900 group-hover:text-white transition-colors">View as Customer</h3>
                            <p className="text-xs text-slate-500 group-hover:text-white/70 mt-0.5 transition-colors">Preview customer portal</p>
                            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-white absolute top-4 right-0 opacity-0 group-hover:opacity-100 transition-all translate-x-1 group-hover:translate-x-0" />
                        </div>
                    </Link>
                </div>

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
                                    <Link to={createPageUrl(portal.href)} target="_blank" className="block mt-2">
                                        <Button variant="outline" className="w-full" size="sm">
                                            Open {portal.title}
                                            <ExternalLink className="w-4 h-4 ml-1" />
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>


            </div>
        </AdminLayout>
    );
}