import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import AdminLayout from '../components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, FolderKanban, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from "recharts";

export default function AdminDashboard() {
    // Queries
    const { data: leads = [] } = useQuery({
        queryKey: ['leads'],
        queryFn: () => base44.entities.Lead.list(),
    });

    const { data: projects = [] } = useQuery({
        queryKey: ['projects'],
        queryFn: () => base44.entities.Project.list(),
    });

    const { data: blogs = [] } = useQuery({
        queryKey: ['blogs'],
        queryFn: () => base44.entities.BlogPost.list(),
    });

    // Calculate stats
    const totalLeads = leads.length;
    const newLeads = leads.filter(l => l.status === 'new').length;
    const activeProjects = projects.length; // Assuming all are active for now
    
    // Mock data for charts
    const trafficData = [
        { name: 'Mon', value: 40 },
        { name: 'Tue', value: 30 },
        { name: 'Wed', value: 45 },
        { name: 'Thu', value: 80 },
        { name: 'Fri', value: 55 },
        { name: 'Sat', value: 20 },
        { name: 'Sun', value: 15 },
    ];

    const stats = [
        {
            title: "Total Leads",
            value: totalLeads,
            change: `+${newLeads} new`,
            trend: "up",
            icon: Users,
            color: "text-blue-600",
            bg: "bg-blue-50"
        },
        {
            title: "Projects",
            value: activeProjects,
            change: "Active portfolio",
            trend: "neutral",
            icon: FolderKanban,
            color: "text-purple-600",
            bg: "bg-purple-50"
        },
        {
            title: "Content",
            value: blogs.length,
            change: "Published posts",
            trend: "up",
            icon: FileText,
            color: "text-amber-600",
            bg: "bg-amber-50"
        },
        {
            title: "Conversion Rate",
            value: "4.2%",
            change: "+0.5% this week",
            trend: "up",
            icon: TrendingUp,
            color: "text-green-600",
            bg: "bg-green-50"
        }
    ];

    return (
        <AdminLayout title="Dashboard">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                {stats.map((stat, index) => (
                    <Card key={index} className="border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-lg ${stat.bg}`}>
                                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                </div>
                                {stat.trend === 'up' && <ArrowUpRight className="w-4 h-4 text-green-500" />}
                                {stat.trend === 'down' && <ArrowDownRight className="w-4 h-4 text-red-500" />}
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
                                <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                            </div>
                            <div className="mt-4 text-xs text-slate-400">
                                {stat.change}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
                <Card className="border-slate-100 shadow-sm">
                    <CardHeader>
                        <CardTitle>Traffic Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={trafficData}>
                                    <XAxis 
                                        dataKey="name" 
                                        stroke="#94a3b8" 
                                        fontSize={12} 
                                        tickLine={false} 
                                        axisLine={false} 
                                    />
                                    <YAxis 
                                        stroke="#94a3b8" 
                                        fontSize={12} 
                                        tickLine={false} 
                                        axisLine={false} 
                                        tickFormatter={(value) => `${value}`} 
                                    />
                                    <Tooltip 
                                        cursor={{ fill: '#f1f5f9' }}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                        {trafficData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={index === 3 ? '#dc2626' : '#cbd5e1'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-100 shadow-sm">
                    <CardHeader>
                        <CardTitle>Recent Leads</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {leads.slice(0, 5).map((lead, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                    <div>
                                        <p className="font-medium text-slate-900">{lead.name}</p>
                                        <p className="text-sm text-slate-500">{lead.serviceType}</p>
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize
                                        ${lead.status === 'new' ? 'bg-blue-100 text-blue-700' : 
                                          lead.status === 'contacted' ? 'bg-amber-100 text-amber-700' :
                                          'bg-green-100 text-green-700'}`}>
                                        {lead.status}
                                    </span>
                                </div>
                            ))}
                            {leads.length === 0 && (
                                <p className="text-center text-slate-500 py-8">No leads yet.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}