import React, { useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import AdminLayout from '../components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
    Users, 
    FileText, 
    TrendingUp, 
    Plus,
    Clock,
    MoreHorizontal,
    MousePointerClick,
    Trash2
} from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import DashboardQuickActions from '../components/admin/DashboardQuickActions';
import DashboardStatCards from '../components/admin/DashboardStatCards';
import DashboardActionItems from '../components/admin/DashboardActionItems';

export default function AdminDashboard() {
    const [isResetting, setIsResetting] = React.useState(false);
    const queryClient = useQueryClient();

    const handleReset = async () => {
        setIsResetting(true);
        try {
            await base44.functions.invoke('resetAnalytics', { target: 'all' });
            queryClient.invalidateQueries();
        } catch (error) {
            console.error("Failed to reset data", error);
        } finally {
            setIsResetting(false);
        }
    };

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
        queryFn: () => base44.entities.SiteVisit.list('-created_date', 1000),
    });

    // Calculate stats
    const totalLeads = leads.length;
    const newLeads = leads.filter(l => l.status === 'new').length;
    
    // Real traffic data
    const [timeRange, setTimeRange] = React.useState("week");

    const trafficData = useMemo(() => {
        const now = new Date();
        const grouped = {};
        
        let dateFormat = 'weekday';
        let iterations = 7;
        
        if (timeRange === 'day') {
            dateFormat = 'hour';
            iterations = 24;
        } else if (timeRange === 'week') {
            dateFormat = 'weekday';
            iterations = 7;
        } else if (timeRange === 'month') {
            dateFormat = 'day';
            iterations = 30;
        } else if (timeRange === 'year') {
            dateFormat = 'month';
            iterations = 12;
        }

        for (let i = iterations - 1; i >= 0; i--) {
            const d = new Date(now);
            let key, label, sortTime;

            if (dateFormat === 'hour') {
                d.setHours(d.getHours() - i);
                key = d.toISOString().slice(0, 13);
                label = d.toLocaleTimeString([], { hour: 'numeric' });
            } else if (dateFormat === 'weekday') {
                d.setDate(d.getDate() - i);
                key = d.toDateString();
                label = d.toLocaleDateString('en-US', { weekday: 'short' });
            } else if (dateFormat === 'day') {
                d.setDate(d.getDate() - i);
                key = d.toDateString();
                label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            } else if (dateFormat === 'month') {
                d.setMonth(d.getMonth() - i);
                key = `${d.getMonth()}-${d.getFullYear()}`;
                label = d.toLocaleDateString('en-US', { month: 'short' });
            }
            
            sortTime = d.getTime();
            grouped[key] = { name: label, value: 0, sort: sortTime };
        }

        const cutoffDate = new Date(Object.values(grouped)[0].sort);
        
        visits.forEach(visit => {
            const vDate = new Date(visit.created_date);
            if (vDate < cutoffDate) return;

            let key;
            if (dateFormat === 'hour') {
                key = vDate.toISOString().slice(0, 13);
            } else if (dateFormat === 'weekday' || dateFormat === 'day') {
                key = vDate.toDateString();
            } else if (dateFormat === 'month') {
                key = `${vDate.getMonth()}-${vDate.getFullYear()}`;
            }

            if (grouped[key]) {
                grouped[key].value++;
            }
        });

        return Object.values(grouped).sort((a, b) => a.sort - b.sort);
    }, [visits, timeRange]);

    const visitsInRange = React.useMemo(() => trafficData.reduce((sum, d) => sum + (d.value || 0), 0), [trafficData]);

    const engagementRate = useMemo(() => {
        if (!visits.length) return { value: "0%", label: "No visits yet" };
        const rate = (leads.length / visits.length) * 100;
        return { 
            value: `${rate.toFixed(1)}%`, 
            label: `${leads.length} leads / ${visits.length} visits` 
        };
    }, [visits, leads]);

    const stats = [
        {
            title: "Site Visits",
            value: visitsInRange,
            change: "in selected period",
            trend: "neutral",
            icon: MousePointerClick,
            color: "text-indigo-600",
            bg: "bg-indigo-50",
            gradient: "from-indigo-500 to-violet-500"
        },
        {
            title: "Total Leads",
            value: totalLeads,
            change: `+${newLeads} new`,
            trend: "up",
            icon: Users,
            color: "text-blue-600",
            bg: "bg-blue-50",
            gradient: "from-blue-500 to-cyan-500"
        },
        {
            title: "Blog Posts",
            value: blogs.length,
            change: "Total published",
            trend: "up",
            icon: FileText,
            color: "text-amber-600",
            bg: "bg-amber-50",
            gradient: "from-amber-500 to-orange-500"
        },
        {
            title: "Engagement",
            value: engagementRate.value,
            change: engagementRate.label,
            trend: "neutral",
            icon: TrendingUp,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
            gradient: "from-emerald-500 to-teal-500"
        }
    ];

    const getInitials = (name) => name?.substring(0, 2).toUpperCase() || '??';

    return (
        <AdminLayout 
            title="Dashboard" 
            actions={
                <div className="flex items-center gap-2">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200">
                                <Trash2 className="w-4 h-4 mr-1.5" />
                                <span className="hidden sm:inline">Reset Data</span>
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Reset All Admin Data?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will permanently delete ALL data (visits, leads, projects, blog posts, estimates). This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleReset} className="bg-red-600 hover:bg-red-700">
                                    {isResetting ? "Resetting..." : "Yes, Delete Everything"}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    <Button asChild size="sm" className="bg-slate-900 shadow-sm">
                        <Link to={createPageUrl('AdminProjects')}>
                            <Plus className="w-4 h-4 mr-1.5" /> New Project
                        </Link>
                    </Button>
                </div>
            }
        >
            <div className="space-y-8">
                {/* Quick Actions - Moved to top for immediate access */}
                <DashboardQuickActions />

                {/* Stats */}
                <DashboardStatCards stats={stats} />

                {/* Action Items */}
                <DashboardActionItems />

                {/* Chart + Leads */}
                <div className="grid gap-6 lg:grid-cols-5">
                    {/* Traffic Chart */}
                    <Card className="lg:col-span-3 border-slate-200/60 shadow-sm overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 bg-gradient-to-r from-slate-50 to-white">
                            <div>
                                <CardTitle className="text-base">Traffic Overview</CardTitle>
                                <CardDescription className="text-xs">Visitors over time</CardDescription>
                            </div>
                            <Select value={timeRange} onValueChange={setTimeRange}>
                                <SelectTrigger className="w-[130px] h-8 text-xs">
                                    <SelectValue placeholder="Select range" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="day">Last 24 Hours</SelectItem>
                                    <SelectItem value="week">Last 7 Days</SelectItem>
                                    <SelectItem value="month">Last 30 Days</SelectItem>
                                    <SelectItem value="year">Last 12 Months</SelectItem>
                                </SelectContent>
                            </Select>
                        </CardHeader>
                        <CardContent className="pl-0 pb-4">
                            <div className="h-[280px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={trafficData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis 
                                            dataKey="name" 
                                            stroke="#94a3b8" 
                                            fontSize={11} 
                                            tickLine={false} 
                                            axisLine={false}
                                            dy={8}
                                        />
                                        <YAxis 
                                            stroke="#94a3b8" 
                                            fontSize={11} 
                                            tickLine={false} 
                                            axisLine={false} 
                                            tickFormatter={(value) => `${value}`} 
                                            dx={-5}
                                        />
                                        <Tooltip 
                                            cursor={{ fill: 'rgba(99, 102, 241, 0.04)' }}
                                            contentStyle={{ 
                                                borderRadius: '10px', 
                                                border: '1px solid #e2e8f0', 
                                                boxShadow: '0 4px 12px rgb(0 0 0 / 0.08)',
                                                padding: '8px 14px',
                                                fontSize: '13px'
                                            }}
                                        />
                                        <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={40}>
                                            {trafficData.map((entry, index) => (
                                                <Cell 
                                                    key={`cell-${index}`} 
                                                    fill={entry.value > 0 ? '#6366f1' : '#e2e8f0'} 
                                                    fillOpacity={entry.value > 0 ? 0.85 : 0.5}
                                                />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Leads */}
                    <Card className="lg:col-span-2 border-slate-200/60 shadow-sm flex flex-col overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between pb-3 bg-gradient-to-r from-slate-50 to-white">
                            <div>
                                <CardTitle className="text-base">Recent Leads</CardTitle>
                                <CardDescription className="text-xs">Latest inquiries</CardDescription>
                            </div>
                            <Button variant="ghost" size="sm" asChild className="text-xs h-7 px-2">
                                <Link to={createPageUrl('AdminLeads')}>View All</Link>
                            </Button>
                        </CardHeader>
                        <CardContent className="flex-1 pt-2">
                            <div className="space-y-4">
                                {leads.slice(0, 5).map((lead, i) => (
                                    <div key={i} className="flex items-center justify-between group gap-3">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <Avatar className="h-8 w-8 border border-slate-100 flex-shrink-0">
                                                <AvatarFallback className="bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600 text-[10px] font-semibold">
                                                    {getInitials(lead.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-slate-900 truncate">
                                                    {lead.name}
                                                </p>
                                                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                                                    <span className="truncate">{lead.serviceType}</span>
                                                    <span>·</span>
                                                    <span className="flex-shrink-0 flex items-center">
                                                        <Clock className="w-3 h-3 mr-0.5" />
                                                        {new Date(lead.created_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1.5 flex-shrink-0">
                                            <Badge className={`
                                                text-[10px] px-1.5 py-0.5 capitalize font-medium
                                                ${lead.status === 'new' ? 'bg-blue-500 hover:bg-blue-600 text-white' : ''}
                                                ${lead.status === 'contacted' ? 'bg-amber-100 text-amber-700' : ''}
                                                ${lead.status === 'won' ? 'bg-emerald-100 text-emerald-700' : ''}
                                                ${lead.status === 'qualified' ? 'bg-violet-100 text-violet-700' : ''}
                                                ${lead.status === 'lost' ? 'bg-slate-100 text-slate-500' : ''}
                                            `}>
                                                {lead.status}
                                            </Badge>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <MoreHorizontal className="w-3.5 h-3.5 text-slate-400" />
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
                                    <div className="flex flex-col items-center justify-center py-8 text-center">
                                        <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-3">
                                            <Users className="w-5 h-5 text-slate-300" />
                                        </div>
                                        <p className="text-sm text-slate-400">No leads yet</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>


            </div>
        </AdminLayout>
    );
}