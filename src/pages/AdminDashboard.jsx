import React, { useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import AdminLayout from '../components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { motion } from "framer-motion";

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
        
        let dateFormat = 'weekday'; // 'hour', 'weekday', 'day', 'month'
        let iterations = 7;
        
        // Define configuration based on selected range
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

        // Initialize buckets with 0
        for (let i = iterations - 1; i >= 0; i--) {
            const d = new Date(now);
            let key, label, sortTime;

            if (dateFormat === 'hour') {
                d.setHours(d.getHours() - i);
                key = d.toISOString().slice(0, 13); // key by hour
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

        // Fill buckets with visit data
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
            label: `Conversion (${leads.length} leads / ${visits.length} visits)` 
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
            bg: "bg-indigo-100/50"
        },
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
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="outline" className="bg-white text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Reset All Data
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
                            <Plus className="w-4 h-4 mr-2" /> New Project
                        </Link>
                    </Button>
                </div>
            }
        >
            <div className="space-y-8">
                {/* Powered by JobTread Animation - Official Branding */}
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-center gap-3 py-3 px-6 rounded-xl shadow-lg overflow-hidden relative"
                    style={{ background: 'linear-gradient(135deg, #0E0F13 0%, #1a1b21 50%, #0E0F13 100%)' }}
                >
                    {/* Dancoby Side */}
                    <motion.div 
                        className="flex items-center gap-2"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <span className="text-red-500 font-bold">Dancoby</span>
                        <span className="text-white font-medium text-sm">Construction</span>
                    </motion.div>
                    
                    {/* Plug Animation with JobTread Colors */}
                    <motion.div 
                        className="flex items-center gap-1 relative"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                    >
                        <motion.div
                            className="w-8 h-0.5 rounded-full"
                            style={{ background: 'linear-gradient(to right, transparent, #FFA875)' }}
                            initial={{ width: 0 }}
                            animate={{ width: 32 }}
                            transition={{ delay: 0.7, duration: 0.4 }}
                        />
                        <motion.div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: '#FFA875', boxShadow: '0 0 12px rgba(255, 168, 117, 0.6)' }}
                            initial={{ scale: 0 }}
                            animate={{ scale: [0, 1.3, 1] }}
                            transition={{ delay: 1.1, duration: 0.3 }}
                        />
                        <motion.div
                            className="w-8 h-0.5 rounded-full"
                            style={{ background: 'linear-gradient(to right, #FFA875, #2439B0)' }}
                            initial={{ width: 0 }}
                            animate={{ width: 32 }}
                            transition={{ delay: 1.3, duration: 0.4 }}
                        />
                    </motion.div>
                    
                    {/* JobTread Logo */}
                    <motion.div 
                        className="flex items-center gap-2"
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 1.6 }}
                    >
                        <span className="text-slate-400 text-xs">powered by</span>
                        <motion.img 
                            src="https://cdn.brandfetch.io/id1TsnZaim/theme/dark/logo.svg?c=1bxid64Mup7aczewSAYMX&t=1670531046955"
                            alt="JobTread"
                            className="h-5"
                            animate={{ 
                                filter: ["drop-shadow(0 0 0px #2439B0)", "drop-shadow(0 0 8px #2439B0)", "drop-shadow(0 0 0px #2439B0)"]
                            }}
                            transition={{ delay: 1.8, duration: 2, repeat: Infinity, repeatDelay: 2 }}
                        />
                    </motion.div>
                </motion.div>

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
                                <CardDescription>Visitors over time</CardDescription>
                            </div>
                            <Select value={timeRange} onValueChange={setTimeRange}>
                                <SelectTrigger className="w-[140px]">
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