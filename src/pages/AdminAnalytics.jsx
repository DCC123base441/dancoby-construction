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
    Cell
} from 'recharts';
import { 
    Users, 
    Calculator, 
    DollarSign, 
    MousePointerClick,
    ArrowUpRight,
    Calendar,
    MapPin
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdminAnalytics() {
    const [timeRange, setTimeRange] = useState('30d'); // 7d, 30d, 90d, 1y

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
        const filteredVisits = visits.filter(v => {
            const date = new Date(v.created_date);
            const diffDays = (now - date) / (1000 * 60 * 60 * 24);
            if (timeRange === '7d') return diffDays <= 7;
            if (timeRange === '30d') return diffDays <= 30;
            if (timeRange === '90d') return diffDays <= 90;
            if (timeRange === '1y') return diffDays <= 365;
            return true;
        });

        // Group by Date
        const groupedByDate = filteredVisits.reduce((acc, curr) => {
            const date = new Date(curr.created_date).toLocaleDateString();
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {});

        const chartData = Object.entries(groupedByDate)
            .map(([date, count]) => ({ date, count }))
            .sort((a, b) => new Date(a.date) - new Date(b.date));

        // Top Pages
        const pageViews = filteredVisits.reduce((acc, curr) => {
            acc[curr.page] = (acc[curr.page] || 0) + 1;
            return acc;
        }, {});
        
        const topPages = Object.entries(pageViews)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5);

        return { total: filteredVisits.length, chartData, topPages };
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
                <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-[180px] bg-white">
                        <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="7d">Last 7 Days</SelectItem>
                        <SelectItem value="30d">Last 30 Days</SelectItem>
                        <SelectItem value="90d">Last 3 Months</SelectItem>
                        <SelectItem value="1y">Last Year</SelectItem>
                    </SelectContent>
                </Select>
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
                                <CardTitle className="text-sm font-medium">Avg. Daily Visits</CardTitle>
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {Math.round(visitsStats.total / (visitsStats.chartData.length || 1))}
                                </div>
                                <p className="text-xs text-muted-foreground">visitors per day</p>
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
                                                dataKey="date" 
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
                                                dataKey="count" 
                                                stroke="#3b82f6" 
                                                fillOpacity={1} 
                                                fill="url(#colorVisits)" 
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="col-span-3">
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
                                                labelLine={true}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="value"
                                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                            >
                                                {estimatesStats.roomTypeData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
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