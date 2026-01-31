import React, { useMemo, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { 
  Loader2, 
  TrendingUp, 
  FileText, 
  Briefcase, 
  MessageSquare,
  DollarSign,
  Activity,
  Users,
  MousePointer2,
  Smartphone,
  Monitor,
  Search,
  Globe,
  LayoutDashboard,
  LogOut,
  ExternalLink,
  Plus,
  Pencil,
  Trash2
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const COLORS = ['#dc2626', '#1f2937', '#6b7280', '#9ca3af', '#d1d5db'];
const GREEN_COLORS = ['#dc2626', '#ef4444', '#f87171', '#fca5a5', '#fee2e2']; // Using Red brand colors instead of green

// Mock data for analytics
const VISITORS_DATA = Array.from({ length: 30 }, (_, i) => ({
  date: `Jan ${i + 1}`,
  visitors: Math.floor(Math.random() * 50) + 20 + (i === 18 ? 60 : 0) // Spike on 19th
}));

const TRAFFIC_SOURCE_DATA = [
  { name: 'Google', value: 45, color: '#dc2626' },
  { name: 'Direct', value: 30, color: '#1f2937' },
  { name: 'Social', value: 15, color: '#6b7280' },
  { name: 'Referral', value: 10, color: '#9ca3af' },
];

const DEVICE_DATA = [
  { name: 'Mobile', value: 64 },
  { name: 'Desktop', value: 36 },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [user, setUser] = useState(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await base44.auth.me();
        if (currentUser) {
          setUser(currentUser);
        } else {
          base44.auth.redirectToLogin(window.location.href);
        }
      } catch (e) {
        base44.auth.redirectToLogin(window.location.href);
      } finally {
        setIsAuthChecking(false);
      }
    };
    checkAuth();
  }, []);

  const { data: projects, isLoading: isLoadingProjects } = useQuery({
    queryKey: ['projects'],
    queryFn: () => base44.entities.Project.list(),
    initialData: [],
  });

  const { data: estimates, isLoading: isLoadingEstimates } = useQuery({
    queryKey: ['estimates'],
    queryFn: () => base44.entities.Estimate.list(),
    initialData: [],
  });

  const { data: testimonials, isLoading: isLoadingTestimonials } = useQuery({
    queryKey: ['testimonials'],
    queryFn: () => base44.entities.Testimonial.list(),
    initialData: [],
  });

  // Calculate Overview Stats
  const stats = useMemo(() => {
    return [
      {
        title: "Total Leads",
        value: estimates.length,
        subtext: `+${estimates.filter(e => new Date(e.created_date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length} in last 7 days`,
        icon: Users
      },
      {
        title: "Qualified Rate",
        value: "100%",
        subtext: `${estimates.length} qualified of ${estimates.length}`,
        icon: Activity
      },
      {
        title: "Google Rating",
        value: "5.0",
        subtext: "Based on Google reviews",
        icon: MessageSquare,
        star: true
      },
      {
        title: "Total Content",
        value: projects.length,
        subtext: `${projects.length} projects in portfolio`,
        icon: FileText
      }
    ];
  }, [projects, estimates, testimonials]);

  // Lead Data
  const leadServiceData = useMemo(() => {
    const counts = {};
    estimates.forEach(e => {
      const type = e.roomType || 'Other';
      counts[type] = (counts[type] || 0) + 1;
    });
    // Sort by value
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [estimates]);

  const leadsOverTimeData = useMemo(() => {
    // Group estimates by day for last 30 days
    const days = {};
    const today = new Date();
    for(let i=29; i>=0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        days[dateStr] = 0;
    }
    
    estimates.forEach(e => {
        const d = new Date(e.created_date);
        const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        if (days[dateStr] !== undefined) {
            days[dateStr]++;
        }
    });

    return Object.entries(days).map(([date, count]) => ({ date, count }));
  }, [estimates]);


  const isLoading = isLoadingProjects || isLoadingEstimates || isLoadingTestimonials || isAuthChecking;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-red-600 mx-auto mb-4" />
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md px-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogOut className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-500 mb-6">You do not have permission to view the admin dashboard.</p>
          <div className="flex gap-4 justify-center">
             <Button variant="outline" asChild>
                <Link to={createPageUrl('Home')}>Return Home</Link>
             </Button>
             <Button onClick={() => base44.auth.logout()}>
                Sign Out
             </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col md:flex-row">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 flex-shrink-0 md:h-screen md:sticky md:top-0">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold">
            D
          </div>
          <div>
            <h2 className="font-bold text-gray-900 leading-tight">Dancoby</h2>
            <p className="text-xs text-gray-500">Admin Console</p>
          </div>
        </div>
        
        <nav className="p-4 space-y-1">
          <Button 
            variant={activeTab === 'overview' ? 'secondary' : 'ghost'} 
            className="w-full justify-start gap-3 font-medium"
            onClick={() => setActiveTab('overview')}
          >
            <LayoutDashboard className="w-4 h-4" />
            Overview
          </Button>
          <Button 
            variant={activeTab === 'analytics' ? 'secondary' : 'ghost'} 
            className="w-full justify-start gap-3 font-medium"
            onClick={() => setActiveTab('analytics')}
          >
            <TrendingUp className="w-4 h-4" />
            Analytics
          </Button>
          <Button 
            variant={activeTab === 'leads' ? 'secondary' : 'ghost'} 
            className="w-full justify-start gap-3 font-medium"
            onClick={() => setActiveTab('leads')}
          >
            <Users className="w-4 h-4" />
            Leads
          </Button>
          <div className="pt-4 pb-2 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Content
          </div>
          <Button 
            variant={activeTab === 'projects' ? 'secondary' : 'ghost'} 
            className="w-full justify-start gap-3 font-medium"
            onClick={() => setActiveTab('projects')}
          >
            <Briefcase className="w-4 h-4" />
            Projects
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 font-medium text-gray-500 hover:text-gray-900"
            asChild
          >
            <Link to={createPageUrl('Home')} target="_blank">
              <ExternalLink className="w-4 h-4" />
              View Site
            </Link>
          </Button>
        </nav>

        <div className="p-4 mt-auto border-t border-gray-100">
           <Button 
             variant="ghost" 
             className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
             onClick={() => base44.auth.logout()}
           >
             <LogOut className="w-4 h-4" />
             Sign Out
           </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-auto">
        
        {/* Top Header Mobile only */}
        <div className="md:hidden flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <Button size="sm" variant="outline" asChild>
             <Link to={createPageUrl('Home')}>View Site</Link>
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8 mt-0 animate-in fade-in-50">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
              <p className="text-gray-500">Overview of your website performance</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, i) => (
                <Card key={i} className="border-none shadow-sm bg-white">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-2 bg-gray-50 rounded-lg text-gray-600">
                        {stat.title}
                      </div>
                      <stat.icon className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                      {stat.value}
                      {stat.star && <span className="text-yellow-400 text-2xl">★</span>}
                    </div>
                    <p className="text-sm text-gray-500">{stat.subtext}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
               <Card className="border-none shadow-sm">
                 <CardHeader>
                   <CardTitle>Recent Leads</CardTitle>
                 </CardHeader>
                 <CardContent>
                   <div className="space-y-4">
                     {estimates.slice(0, 4).map((lead, i) => (
                       <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                         <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center font-bold text-red-600 border border-gray-100">
                             {lead.userName ? lead.userName.charAt(0) : '?'}
                           </div>
                           <div>
                             <p className="font-semibold text-gray-900 text-sm">{lead.userName || 'Anonymous'}</p>
                             <p className="text-xs text-gray-500">{lead.roomType}</p>
                           </div>
                         </div>
                         <div className="text-right">
                           <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-200">Qualified</Badge>
                           <p className="text-[10px] text-gray-400 mt-1">{new Date(lead.created_date).toLocaleDateString()}</p>
                         </div>
                       </div>
                     ))}
                     {estimates.length === 0 && (
                         <div className="text-center py-8 text-gray-400">No leads yet</div>
                     )}
                   </div>
                   <Button variant="ghost" className="w-full mt-4 text-sm text-gray-500 hover:text-gray-900" onClick={() => setActiveTab('leads')}>
                     View All Leads
                   </Button>
                 </CardContent>
               </Card>

               <Card className="border-none shadow-sm">
                 <CardHeader>
                   <CardTitle>Leads Over Time</CardTitle>
                 </CardHeader>
                 <CardContent className="h-[300px]">
                   <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={leadsOverTimeData}>
                       <defs>
                         <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#dc2626" stopOpacity={0.1}/>
                           <stop offset="95%" stopColor="#dc2626" stopOpacity={0}/>
                         </linearGradient>
                       </defs>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                       <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} tickMargin={10} minTickGap={30} />
                       <YAxis hide />
                       <Tooltip 
                         contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                         cursor={{ stroke: '#dc2626', strokeWidth: 1, strokeDasharray: '4 4' }}
                       />
                       <Area type="monotone" dataKey="count" stroke="#dc2626" strokeWidth={2} fillOpacity={1} fill="url(#colorLeads)" />
                     </AreaChart>
                   </ResponsiveContainer>
                 </CardContent>
               </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-8 mt-0 animate-in fade-in-50">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
              <p className="text-gray-500">Track visitor behavior and performance</p>
            </div>

            {/* Visitors Chart */}
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>Visitors Over Time</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                 <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={VISITORS_DATA}>
                     <defs>
                       <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="5%" stopColor="#1f2937" stopOpacity={0.1}/>
                         <stop offset="95%" stopColor="#1f2937" stopOpacity={0}/>
                       </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                     <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} tickMargin={10} minTickGap={30} />
                     <YAxis fontSize={12} tickLine={false} axisLine={false} />
                     <Tooltip 
                         contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                     />
                     <Area type="monotone" dataKey="visitors" stroke="#1f2937" strokeWidth={2} fillOpacity={1} fill="url(#colorVisitors)" />
                   </AreaChart>
                 </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
               {/* Traffic Sources */}
               <Card className="border-none shadow-sm">
                 <CardHeader>
                   <CardTitle>Traffic Sources</CardTitle>
                 </CardHeader>
                 <CardContent className="h-[300px] flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={TRAFFIC_SOURCE_DATA}
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {TRAFFIC_SOURCE_DATA.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                      </PieChart>
                    </ResponsiveContainer>
                 </CardContent>
               </Card>
               
               {/* Devices & Top Pages */}
               <div className="space-y-6">
                 <Card className="border-none shadow-sm">
                   <CardHeader>
                     <CardTitle>Devices</CardTitle>
                   </CardHeader>
                   <CardContent className="space-y-6">
                      {DEVICE_DATA.map((device, i) => (
                        <div key={i}>
                          <div className="flex justify-between text-sm mb-2">
                             <div className="flex items-center gap-2">
                               {device.name === 'Mobile' ? <Smartphone className="w-4 h-4 text-gray-500"/> : <Monitor className="w-4 h-4 text-gray-500"/>}
                               <span className="font-medium text-gray-700">{device.name}</span>
                             </div>
                             <span className="font-bold text-gray-900">{device.value}%</span>
                          </div>
                          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                             <div className="h-full bg-gray-900 rounded-full" style={{ width: `${device.value}%` }} />
                          </div>
                        </div>
                      ))}
                   </CardContent>
                 </Card>

                 <Card className="border-none shadow-sm flex-1">
                    <CardHeader>
                      <CardTitle>Top Pages</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { name: '/estimator', views: 127 },
                          { name: '/', views: 98 },
                          { name: '/projects', views: 54 },
                          { name: '/services', views: 32 },
                        ].map((page, i) => (
                          <div key={i} className="flex justify-between items-center text-sm">
                             <div className="flex items-center gap-2 text-gray-600">
                               <span className="text-gray-400 w-4">{i+1}.</span>
                               <ExternalLink className="w-3 h-3 text-gray-400" />
                               {page.name}
                             </div>
                             <span className="font-semibold text-gray-900">{page.views}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                 </Card>
               </div>
            </div>
          </TabsContent>

          {/* Leads Tab */}
          <TabsContent value="leads" className="space-y-8 mt-0 animate-in fade-in-50">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Leads</h1>
              <p className="text-gray-500">Manage your estimate requests</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
               <Card className="border-none shadow-sm">
                 <CardHeader>
                   <CardTitle>Leads by Service</CardTitle>
                   <CardDescription>Most requested renovation types</CardDescription>
                 </CardHeader>
                 <CardContent className="h-[300px]">
                   <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={leadServiceData} layout="vertical" margin={{ left: 40 }}>
                       <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
                       <XAxis type="number" hide />
                       <YAxis dataKey="name" type="category" width={100} fontSize={12} tickLine={false} axisLine={false} />
                       <Tooltip cursor={{fill: '#f8f9fa'}} contentStyle={{ borderRadius: '8px', border: 'none' }} />
                       <Bar dataKey="value" fill="#1f2937" radius={[0, 4, 4, 0]} barSize={24} />
                     </BarChart>
                   </ResponsiveContainer>
                 </CardContent>
               </Card>

               <Card className="border-none shadow-sm">
                 <CardHeader>
                    <CardTitle>Lead Sources</CardTitle>
                    <CardDescription>Where leads are coming from</CardDescription>
                 </CardHeader>
                 <CardContent className="flex items-center justify-center h-[300px]">
                    <div className="flex items-center gap-8">
                       <div className="relative w-40 h-40">
                         {/* Simple visual representation since we don't have source tracking yet */}
                         <svg viewBox="0 0 32 32" className="w-full h-full transform -rotate-90">
                           <circle cx="16" cy="16" r="16" fill="#1f2937" />
                           <circle cx="16" cy="16" r="10" fill="white" />
                         </svg>
                       </div>
                       <div className="space-y-3">
                          <div className="flex items-center gap-2">
                             <div className="w-3 h-3 rounded-full bg-gray-900" />
                             <span className="text-sm font-medium">Estimate Tool</span>
                             <span className="text-sm font-bold ml-auto">{estimates.length}</span>
                          </div>
                          <div className="flex items-center gap-2 opacity-50">
                             <div className="w-3 h-3 rounded-full bg-gray-400" />
                             <span className="text-sm font-medium">Contact Form</span>
                             <span className="text-sm font-bold ml-auto">0</span>
                          </div>
                       </div>
                    </div>
                 </CardContent>
               </Card>
            </div>

            <Card className="border-none shadow-sm">
               <CardHeader>
                 <CardTitle>All Leads</CardTitle>
               </CardHeader>
               <CardContent>
                 <Table>
                   <TableHeader>
                     <TableRow>
                       <TableHead>Date</TableHead>
                       <TableHead>Name</TableHead>
                       <TableHead>Service</TableHead>
                       <TableHead>Budget Range</TableHead>
                       <TableHead>Status</TableHead>
                       <TableHead className="text-right">Actions</TableHead>
                     </TableRow>
                   </TableHeader>
                   <TableBody>
                     {estimates.map((lead) => (
                       <TableRow key={lead.id}>
                         <TableCell className="font-medium text-gray-500">
                           {new Date(lead.created_date).toLocaleDateString()}
                         </TableCell>
                         <TableCell className="font-semibold text-gray-900">{lead.userName || 'Anonymous'}</TableCell>
                         <TableCell>{lead.roomType}</TableCell>
                         <TableCell>
                           {lead.estimatedCost?.min ? 
                               `$${(lead.estimatedCost.min/1000).toFixed(0)}k - $${(lead.estimatedCost.max/1000).toFixed(0)}k` 
                               : '-'}
                         </TableCell>
                         <TableCell>
                           <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">New Lead</Badge>
                         </TableCell>
                         <TableCell className="text-right">
                           <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                             <Search className="h-4 w-4" />
                           </Button>
                         </TableCell>
                       </TableRow>
                     ))}
                   </TableBody>
                 </Table>
               </CardContent>
            </Card>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-8 mt-0 animate-in fade-in-50">
             <div className="flex justify-between items-center">
               <div>
                 <h1 className="text-3xl font-bold text-gray-900 mb-2">Projects</h1>
                 <p className="text-gray-500">Manage your portfolio projects</p>
               </div>
               <Button className="bg-gray-900 text-white hover:bg-black">
                 <Plus className="w-4 h-4 mr-2" />
                 Add Project
               </Button>
             </div>

             <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Search projects..." 
                      className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-gray-900 outline-none"
                    />
                  </div>
                </div>
                <div className="divide-y divide-gray-100">
                  {projects.map((project) => (
                    <div key={project.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                          {project.mainImage ? (
                            <img src={project.mainImage} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <Briefcase className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{project.title}</h3>
                          <p className="text-sm text-gray-500">{project.location || project.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-900">
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
             </div>
          </TabsContent>

        </Tabs>
      </main>
    </div>
  );
}