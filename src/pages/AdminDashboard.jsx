import React from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { 
  Users, 
  FolderKanban, 
  FileText, 
  TrendingUp, 
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function AdminDashboard() {
  // Fetch Stats
  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: () => base44.entities.Project.list(),
    initialData: []
  });

  const { data: estimates } = useQuery({
    queryKey: ['estimates'],
    queryFn: () => base44.entities.Estimate.list(),
    initialData: []
  });

  const { data: leads } = useQuery({
    queryKey: ['leads'],
    queryFn: () => base44.entities.Lead.list(),
    initialData: []
  });

  const { data: posts } = useQuery({
    queryKey: ['blogPosts'],
    queryFn: () => base44.entities.BlogPost.list(),
    initialData: []
  });

  // Derived Stats
  const totalLeads = (leads?.length || 0) + (estimates?.length || 0);
  const activeProjects = projects?.length || 0; // Assuming all listed are active for now
  const publishedPosts = posts?.filter(p => p.status === 'published').length || 0;

  // Mock Chart Data (Since we don't have historical analytics API yet)
  const trafficData = [
    { name: 'Mon', visits: 120 },
    { name: 'Tue', visits: 132 },
    { name: 'Wed', visits: 101 },
    { name: 'Thu', visits: 134 },
    { name: 'Fri', visits: 190 },
    { name: 'Sat', visits: 230 },
    { name: 'Sun', visits: 210 },
  ];

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h1>
        <p className="text-gray-500 mt-2">Welcome back. Here's what's happening with your website.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard 
          title="Total Leads" 
          value={totalLeads} 
          icon={Users}
          trend="+12%"
          trendUp={true}
          description="from last month"
        />
        <StatsCard 
          title="Active Projects" 
          value={activeProjects} 
          icon={FolderKanban}
          trend="+2"
          trendUp={true}
          description="new this month"
        />
        <StatsCard 
          title="Blog Posts" 
          value={publishedPosts} 
          icon={FileText}
          trend="+5"
          trendUp={true}
          description="published total"
        />
        <StatsCard 
          title="Est. Revenue" 
          value="$1.2M" 
          icon={TrendingUp}
          trend="+8.2%"
          trendUp={true}
          description="in pipeline"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <Card className="lg:col-span-2 shadow-sm border-gray-200">
          <CardHeader>
            <CardTitle>Traffic Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trafficData}>
                  <defs>
                    <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#dc2626" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#dc2626" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Area type="monotone" dataKey="visits" stroke="#dc2626" strokeWidth={3} fillOpacity={1} fill="url(#colorVisits)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-gray-200">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                { type: 'lead', msg: 'New estimate request from Sarah J.', time: '2 min ago' },
                { type: 'project', msg: 'Updated photos for "Brooklyn Heights"', time: '2 hours ago' },
                { type: 'blog', msg: 'Published "5 Kitchen Trends for 2024"', time: '5 hours ago' },
                { type: 'lead', msg: 'New vendor registration: ABC Plumbing', time: '1 day ago' },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${
                    item.type === 'lead' ? 'bg-blue-500' : 
                    item.type === 'project' ? 'bg-green-500' : 'bg-purple-500'
                  }`} />
                  <div>
                    <p className="text-sm font-medium text-gray-800">{item.msg}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" /> {item.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

function StatsCard({ title, value, icon: Icon, trend, trendUp, description }) {
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-200 border-gray-200">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className={`p-2 rounded-lg ${trendUp ? 'bg-green-50' : 'bg-red-50'}`}>
            <Icon className={`w-5 h-5 ${trendUp ? 'text-green-600' : 'text-red-600'}`} />
          </div>
          <span className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${
            trendUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {trendUp ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
            {trend}
          </span>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
          <div className="text-2xl font-bold text-gray-900">{value}</div>
          <p className="text-xs text-gray-400 mt-1">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}