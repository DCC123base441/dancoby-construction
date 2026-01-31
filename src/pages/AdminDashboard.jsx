import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import AdminLayout from '../components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
    Users, 
    FileText, 
    FolderKanban, 
    TrendingUp, 
    ArrowUpRight, 
    ArrowDownRight,
    Plus,
    ArrowRight,
    Clock,
    MoreHorizontal
} from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell, CartesianGrid } from "recharts";
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AdminDashboard() {
    // Queries
    const { data: leads = [] } = useQuery({
        queryKey: ['leads'],
        queryFn: () => base44.entities.Lead.list('-created_date', 1000),
    });

    const { data: projects = [] } = useQuery({
        queryKey: ['projects'],
        queryFn: () => base44.entities.Project.list(),
    });

    const { data: blogs = [] } = useQuery({
        queryKey: ['blogs'],
        queryFn: () => base44.entities.BlogPost.list(),
    });

    const { data: visits = [] } = useQuery({
        queryKey: ['siteVisits'],
        queryFn: () => base44.entities.SiteVisit.list('-created_date', 5000),
    });

    const [timeRange, setTimeRange] = useState('week');

    // Calculate stats
    const totalLeads = leads.length;
    const newLeads = leads.filter(l => l.status === 'new').length;
    
    // Real traffic data
    const trafficData = useMemo(() => {
        const now = new Date();
        const visitsByDate = {};
        
        if (timeRange === 'day') {
            const startOfDay = new Date(now);
            startOfDay.setHours(0,0,0,0);
            
            const hours = Array.from({ length: 24 }, (_, i) => {
                const d = new Date(startOfDay);
                d.setHours(i);
                return d;
            });

            visits.forEach(v => {
                const d = new Date(v.created_date);
                if (d >= startOfDay) {
                    const hour = d.getHours();
                    visitsByDate[hour] = (visitsByDate[hour] || 0) + 1;
                }
            });

            return hours.map(date => ({
                name: date.getHours().toString().padStart(2, '0') + ':00',
                value: visitsByDate[date.getHours()] || 0
            }));
        } 
        
        if (timeRange === 'week') {
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const last7Days = Array.from({ length: 7 }, (_, i) => {
                const d = new Date(now);
                d.setDate(now.getDate() - (6 - i));
                return d;
            });

            visits.forEach(v => {
                const dateStr = new Date(v.created_date).toLocaleDateString();
                visitsByDate[dateStr] = (visitsByDate[dateStr] || 0) + 1;
            });

            return last7Days.map(date => ({
                name: days[date.getDay()],
                value: visitsByDate[date.toLocaleDateString()] || 0
            }));
        }

        if (timeRange === 'month') {
            const last30Days = Array.from({ length: 30 }, (_, i) => {
                const d = new Date(now);
                d.setDate(now.getDate() - (29 - i));
                return d;
            });

            visits.forEach(v => {
                const dateStr = new Date(v.created_date).toLocaleDateString();
                visitsByDate[dateStr] = (visitsByDate[dateStr] || 0) + 1;
            });

            return last30Days.map(date => ({
                name: date.getDate(),
                value: visitsByDate[date.toLocaleDateString()] || 0
            }));
        }

        if (timeRange === 'year') {
            const last12Months = Array.from({ length: 12 }, (_, i) => {
                const d = new Date(now);
                d.setMonth(now.getMonth() - (11 - i));
                return d;
            });

            visits.forEach(v => {
                const d = new Date(v.created_date);
                const key = `${d.getMonth()}-${d.getFullYear()}`;
                visitsByDate[key] = (visitsByDate[key] || 0) + 1;
            });

            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return last12Months.map(date => ({
                name: monthNames[date.getMonth()],
                value: visitsByDate[`${date.getMonth()}-${date.getFullYear()}`] || 0
            }));
        }
        
        return [];
    }, [visits, timeRange]);

    const engagementRate = useMemo(() => {
        if (!visits.length) return { value: "0%", label: "No visits yet" };
        const rate = (leads.length / visits.length) * 100;
        return { 
            value: `${rate.toFixed(1)}%`, 
            label: `Conversion (${leads.length} leads / ${visits.length} visits)` 
        };
    }, [visits, leads]);

    const stats = [
        {
            title: "Total Leads",
            value: totalLeads,
            change: `+${newLeads} new`,
            trend: "up",
            icon: Users,
            color: "text-blue-600",
            bg: "bg-blue-100/50"
        },
        {
            title: "Blog Posts",
            value: blogs.length,
            change: "Total posts",
            trend: "up",
            icon: FileText,
            color: "text-amber-600",
            bg: "bg-amber-100/50"
        },
        {
            title: "Engagement",
            value: engagementRate.value,
            change: engagementRate.label,
            trend: "neutral",
            icon: TrendingUp,
            color: "text-emerald-600",
            bg: "bg-emerald-100/50"
        }
    ];

    const getInitials = (name) => name?.substring(0, 2).toUpperCase() || '??';

    return (
        <AdminLayout 
            title="Overview" 
            actions={
                <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-500 mr-2 hidden sm:inline-block">
                        {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                    <Button asChild size="sm" className="bg-slate-900 shadow-sm">
                        <Link to={createPageUrl('AdminProjects')}>
                            <Plus className="w-4 h-4 mr-2" /> New Project
                        </Link>
                    </Button>
                </div>
            }
        >
            <div className="space-y-8">
                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat, index) => (
                        <Card key={index} className="border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-200">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between space-y-0 pb-2">
                                    <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                                    <div className={`p-2 rounded-full ${stat.bg}`}>
                                        <stat.icon className={`w-4 h-4 ${stat.color}`} />
                                    </div>
                                </div>
                                <div className="flex items-end justify-between mt-2">
                                    <div>
                                        <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                                        <div className="flex items-center text-xs text-slate-500 mt-1">
                                            {stat.trend === 'up' ? (
                                                <ArrowUpRight className="w-3 h-3 text-emerald-500 mr-1" />
                                            ) : (
                                                <ArrowRight className="w-3 h-3 text-slate-400 mr-1" />
                                            )}
                                            {stat.change}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid gap-8 lg:grid-cols-7">
                    {/* Main Chart Section - Takes up 4/7 columns */}
                    <Card className="lg:col-span-4 border-slate-200/60 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
                            <div className="space-y-1">
                                <CardTitle>Traffic Overview</CardTitle>
                                <CardDescription>
                                    {timeRange === 'day' ? 'Hourly' : timeRange === 'year' ? 'Monthly' : 'Daily'} visitors
                                </CardDescription>
                            </div>
                            <Select value={timeRange} onValueChange={setTimeRange}>
                                <SelectTrigger className="w-[120px]">
                                    <SelectValue placeholder="Range" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="day">Day</SelectItem>
                                    <SelectItem value="week">Week</SelectItem>
                                    <SelectItem value="month">Month</SelectItem>
                                    <SelectItem value="year">Year</SelectItem>
                                </SelectContent>
                            </Select>
                        </CardHeader>
                        <CardContent className="pl-0">
                            <div className="h-[350px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={trafficData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                        <XAxis 
                                            dataKey="name" 
                                            stroke="#64748b" 
                                            fontSize={12} 
                                            tickLine={false} 
                                            axisLine={false}
                                            dy={10}
                                        />
                                        <YAxis 
                                            stroke="#64748b" 
                                            fontSize={12} 
                                            tickLine={false} 
                                            axisLine={false} 
                                            tickFormatter={(value) => `${value}`} 
                                            dx={-10}
                                        />
                                        <Tooltip 
                                            cursor={{ fill: '#f8fafc' }}
                                            contentStyle={{ 
                                                borderRadius: '8px', 
                                                border: '1px solid #e2e8f0', 
                                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                                padding: '8px 12px'
                                            }}
                                        />
                                        <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={50}>
                                            {trafficData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={index === 3 ? '#0f172a' : '#cbd5e1'} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Leads/Activity - Takes up 3/7 columns */}
                    <Card className="lg:col-span-3 border-slate-200/60 shadow-sm flex flex-col">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <div>
                                <CardTitle>Recent Leads</CardTitle>
                                <CardDescription>Latest potential client inquiries</CardDescription>
                            </div>
                            <Button variant="ghost" size="sm" asChild className="text-xs">
                                <Link to={createPageUrl('AdminLeads')}>View All</Link>
                            </Button>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <div className="space-y-6">
                                {leads.slice(0, 5).map((lead, i) => (
                                    <div key={i} className="flex items-start justify-between group">
                                        <div className="flex items-start gap-4">
                                            <Avatar className="h-9 w-9 border border-slate-100">
                                                <AvatarFallback className="bg-slate-50 text-slate-600 text-xs font-medium">
                                                    {getInitials(lead.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium leading-none text-slate-900 group-hover:text-blue-600 transition-colors cursor-pointer">
                                                    {lead.name}
                                                </p>
                                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                                    <span>{lead.serviceType}</span>
                                                    <span>•</span>
                                                    <span className="flex items-center">
                                                        <Clock className="w-3 h-3 mr-1" />
                                                        {new Date(lead.created_date).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant={
                                                lead.status === 'new' ? 'default' : 
                                                'secondary'
                                            } className={`
                                                capitalize font-normal
                                                ${lead.status === 'new' ? 'bg-blue-600 hover:bg-blue-700' : ''}
                                                ${lead.status === 'contacted' ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' : ''}
                                                ${lead.status === 'won' ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' : ''}
                                            `}>
                                                {lead.status}
                                            </Badge>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <MoreHorizontal className="w-4 h-4 text-slate-400" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem>View Details</DropdownMenuItem>
                                                    <DropdownMenuItem>Contact</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                ))}
                                {leads.length === 0 && (
                                    <div className="flex flex-col items-center justify-center py-8 text-center text-slate-500">
                                        <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-3">
                                            <Users className="w-6 h-6 text-slate-300" />
                                        </div>
                                        <p className="text-sm">No recent leads found.</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions Row */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Link to={createPageUrl('AdminProjects')} className="group block">
                        <Card className="border-slate-200/60 shadow-sm hover:border-slate-300 hover:shadow-md transition-all">
                            <CardContent className="p-6 flex items-center gap-4">
                                <div className="p-3 rounded-lg bg-violet-100 group-hover:bg-violet-600 transition-colors">
                                    <FolderKanban className="w-6 h-6 text-violet-600 group-hover:text-white transition-colors" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900">Manage Projects</h3>
                                    <p className="text-sm text-slate-500">Update portfolio & case studies</p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                    
                    <Link to={createPageUrl('AdminBlog')} className="group block">
                        <Card className="border-slate-200/60 shadow-sm hover:border-slate-300 hover:shadow-md transition-all">
                            <CardContent className="p-6 flex items-center gap-4">
                                <div className="p-3 rounded-lg bg-amber-100 group-hover:bg-amber-600 transition-colors">
                                    <FileText className="w-6 h-6 text-amber-600 group-hover:text-white transition-colors" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900">Write Blog Post</h3>
                                    <p className="text-sm text-slate-500">Create content with AI assistance</p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link to={createPageUrl('AdminAnalytics')} className="group block">
                        <Card className="border-slate-200/60 shadow-sm hover:border-slate-300 hover:shadow-md transition-all">
                            <CardContent className="p-6 flex items-center gap-4">
                                <div className="p-3 rounded-lg bg-emerald-100 group-hover:bg-emerald-600 transition-colors">
                                    <TrendingUp className="w-6 h-6 text-emerald-600 group-hover:text-white transition-colors" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900">View Analytics</h3>
                                    <p className="text-sm text-slate-500">Check detailed site metrics</p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                </div>
            </div>
        </AdminLayout>
    );
}