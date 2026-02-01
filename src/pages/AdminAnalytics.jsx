import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import AdminLayout from '../components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    LineChart,
    Line,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts';
import { 
    Users, 
    Calculator, 
    DollarSign, 
    MousePointerClick,
    ArrowUpRight,
    Calendar,
    MapPin,
    Trash2
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
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
import { useQueryClient } from "@tanstack/react-query";

export default function AdminAnalytics() {
    const [timeRange, setTimeRange] = useState('week');
    const [isResetting, setIsResetting] = useState(false);
    const queryClient = useQueryClient();

    const handleReset = async () => {
        setIsResetting(true);
        try {
            await base44.functions.invoke('resetAnalytics', { target: 'visits' });
            queryClient.invalidateQueries({ queryKey: ['siteVisits'] });
        } catch (error) {
            console.error("Failed to reset analytics", error);
        } finally {
            setIsResetting(false);
        }
    };

    // Fetch Data
    const { data: visits = [] } = useQuery({
        queryKey: ['siteVisits'],
        queryFn: () => base44.entities.SiteVisit.list('-created_date', 1000),
    });

    const { data: estimates = [] } = useQuery({
        queryKey: ['estimates'],
        queryFn: () => base44.entities.Estimate.list('-created_date', 1000),
    });

    // Process Visits Data
    const visitsStats = useMemo(() => {
        const now = new Date();
        const grouped = {};
        
        let dateFormat = 'weekday'; // 'hour', 'weekday', 'day', 'month'
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

        // Initialize buckets
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

        // Filter and count visits
        let totalCount = 0;
        const pageViews = {};
        const locationCounts = {};
        
        const cutoffDate = new Date(Object.values(grouped)[0].sort);
        // Adjust cutoff for hour precision or day precision
        if (dateFormat === 'hour') {
            cutoffDate.setMinutes(0, 0, 0); 
        } else {
            cutoffDate.setHours(0, 0, 0, 0);
        }

        visits.forEach(visit => {
            const vDate = new Date(visit.created_date);
            if (vDate < cutoffDate) return;

            totalCount++;

            // Count for chart
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

            // Count for top pages
            pageViews[visit.page] = (pageViews[visit.page] || 0) + 1;

            // Count for top locations
            let loc = 'Unknown';
            if (visit.city && visit.state) {
                loc = `${visit.city}, ${visit.state}`;
            } else if (visit.city && visit.country) {
                loc = `${visit.city}, ${visit.country}`;
            } else if (visit.state && visit.country) {
                loc = `${visit.state}, ${visit.country}`;
            } else if (visit.country) {
                loc = visit.country;
            }

            locationCounts[loc] = (locationCounts[loc] || 0) + 1;
        });

        const chartData = Object.values(grouped).sort((a, b) => a.sort - b.sort);

        const topPages = Object.entries(pageViews)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5);

        const topLocations = Object.entries(locationCounts)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5);

        return { total: totalCount, chartData, topPages, topLocations };
    }, [visits, timeRange]);

    // Process Estimates Data
    const estimatesStats = useMemo(() => {
        const total = estimates.length;
        const totalValue = estimates.reduce((acc, curr) => acc + (curr.estimatedCost?.min || 0), 0);
        
        // Room Types Distribution
        const roomTypes = estimates.reduce((acc, curr) => {
            acc[curr.roomType] = (acc[curr.roomType] || 0) + 1;
            return acc;
        }, {});
        const roomTypeData = Object.entries(roomTypes).map(([name, value]) => ({ name, value }));

        // Value Over Time
        const groupedValue = estimates.reduce((acc, curr) => {
            const date = new Date(curr.created_date).toLocaleDateString();
            acc[date] = (acc[date] || 0) + (curr.estimatedCost?.min || 0);
            return acc;
        }, {});
        const valueChartData = Object.entries(groupedValue)
            .map(([date, value]) => ({ date, value }))
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(-10); // Last 10 days with activity

        return { total, totalValue, roomTypeData, valueChartData };
    }, [estimates]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
            notation: "compact"
        }).format(amount);
    };

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    return (
        <AdminLayout 
            title="Analytics Dashboard"
            actions={
                <div className="flex items-center gap-2">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="outline" className="bg-white text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Reset Data
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Reset Analytics Data?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will permanently delete all recorded site visits history. This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleReset} className="bg-red-600 hover:bg-red-700">
                                    {isResetting ? "Resetting..." : "Yes, Delete History"}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger className="w-[180px] bg-white">
                            <SelectValue placeholder="Select range" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="day">Last 24 Hours</SelectItem>
                            <SelectItem value="week">Last 7 Days</SelectItem>
                            <SelectItem value="month">Last 30 Days</SelectItem>
                            <SelectItem value="year">Last 12 Months</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            }
        >
            <Tabs defaultValue="traffic" className="space-y-8">
                <TabsList className="bg-white border border-slate-200">
                    <TabsTrigger value="traffic">Site Traffic</TabsTrigger>
                    <TabsTrigger value="estimator">Estimator Tool</TabsTrigger>
                </TabsList>

                {/* TRAFFIC TAB */}
                <TabsContent value="traffic" className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{visitsStats.total}</div>
                                <p className="text-xs text-muted-foreground">in selected period</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Avg. Visits</CardTitle>
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {Math.round(visitsStats.total / (visitsStats.chartData.length || 1))}
                                </div>
                                <p className="text-xs text-muted-foreground">per period</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Top Page</CardTitle>
                                <MousePointerClick className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold truncate">
                                    {visitsStats.topPages[0]?.name || 'N/A'}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {visitsStats.topPages[0]?.value || 0} views
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="col-span-4">
                            <CardHeader>
                                <CardTitle>Visits Over Time</CardTitle>
                                <CardDescription>Daily traffic trends</CardDescription>
                            </CardHeader>
                            <CardContent className="pl-2">
                                <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={visitsStats.chartData}>
                                            <defs>
                                                <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <XAxis 
                                                dataKey="name" 
                                                stroke="#888888" 
                                                fontSize={12} 
                                                tickLine={false} 
                                                axisLine={false} 
                                                minTickGap={30}
                                            />
                                            <YAxis 
                                                stroke="#888888" 
                                                fontSize={12} 
                                                tickLine={false} 
                                                axisLine={false} 
                                            />
                                            <Tooltip />
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <Area 
                                                type="monotone" 
                                                dataKey="value" 
                                                stroke="#3b82f6" 
                                                fillOpacity={1} 
                                                fill="url(#colorVisits)" 
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                        <div className="col-span-3 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Top Pages</CardTitle>
                                    <CardDescription>Most visited sections</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {visitsStats.topPages.map((page, i) => (
                                            <div key={i} className="flex items-center justify-between">
                                                <div className="flex items-center gap-2 max-w-[80%]">
                                                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                                                    <span className="text-sm font-medium truncate">{page.name}</span>
                                                </div>
                                                <span className="text-sm text-slate-500">{page.value}</span>
                                            </div>
                                        ))}
                                        {visitsStats.topPages.length === 0 && (
                                            <div className="text-center text-slate-500 py-8">No data yet</div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Top Locations</CardTitle>
                                    <CardDescription>Visitor demographics</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {visitsStats.topLocations.map((loc, i) => (
                                            <div key={i} className="flex items-center justify-between">
                                                <div className="flex items-center gap-2 max-w-[80%]">
                                                    <MapPin className="w-3 h-3 text-red-500" />
                                                    <span className="text-sm font-medium truncate">{loc.name}</span>
                                                </div>
                                                <span className="text-sm text-slate-500">{loc.value}</span>
                                            </div>
                                        ))}
                                        {visitsStats.topLocations.length === 0 && (
                                            <div className="text-center text-slate-500 py-4">No data yet</div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Recent Visits</CardTitle>
                                    <CardDescription>Latest raw traffic data</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {visits.slice(0, 5).map((visit, i) => (
                                            <div key={i} className="flex flex-col gap-1 border-b border-slate-100 last:border-0 pb-2 last:pb-0">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-medium truncate max-w-[150px]">{visit.page}</span>
                                                    <span className="text-xs text-slate-400">
                                                        {new Date(visit.created_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between text-xs text-slate-500">
                                                    <div className="flex items-center gap-1">
                                                        <MapPin className="w-3 h-3" />
                                                        <span>{visit.city ? `${visit.city}, ${visit.state || visit.country}` : 'Unknown Location'}</span>
                                                    </div>
                                                    <span>{visit.ip || 'No IP'}</span>
                                                </div>
                                            </div>
                                        ))}
                                        {visits.length === 0 && (
                                            <div className="text-center text-slate-500 py-4">No data yet</div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                {/* ESTIMATOR TAB */}
                <TabsContent value="estimator" className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Estimates</CardTitle>
                                <Calculator className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{estimatesStats.total}</div>
                                <p className="text-xs text-muted-foreground">Lifetime submissions</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{formatCurrency(estimatesStats.totalValue)}</div>
                                <p className="text-xs text-muted-foreground">Total estimated minimums</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {visitsStats.total > 0 
                                        ? ((estimatesStats.total / visitsStats.total) * 100).toFixed(1) 
                                        : 0}%
                                </div>
                                <p className="text-xs text-muted-foreground">Visits to estimates</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Popular Renovations</CardTitle>
                                <CardDescription>Estimates by room type</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={estimatesStats.roomTypeData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {estimatesStats.roomTypeData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend verticalAlign="bottom" height={36}/>
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Value Generated</CardTitle>
                                <CardDescription>Estimated project value (last 10 active days)</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={estimatesStats.valueChartData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis 
                                                dataKey="date" 
                                                stroke="#888888" 
                                                fontSize={12} 
                                                tickLine={false} 
                                                axisLine={false}
                                            />
                                            <YAxis 
                                                stroke="#888888" 
                                                fontSize={12} 
                                                tickLine={false} 
                                                axisLine={false}
                                                tickFormatter={(value) => `$${value/1000}k`}
                                            />
                                            <Tooltip formatter={(value) => formatCurrency(value)} />
                                            <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </AdminLayout>
    );
}