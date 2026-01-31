import React, { useMemo } from 'react';
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
  Legend
} from 'recharts';
import { 
  Loader2, 
  TrendingUp, 
  FileText, 
  Briefcase, 
  MessageSquare,
  DollarSign,
  Activity
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

const COLORS = ['#dc2626', '#1f2937', '#6b7280', '#9ca3af', '#d1d5db'];

export default function AdminDashboard() {
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

  // Calculate Stats
  const stats = useMemo(() => {
    const totalProjectValue = estimates.reduce((acc, curr) => {
        // Average of min and max estimate if available
        if (curr.estimatedCost?.min && curr.estimatedCost?.max) {
            return acc + ((curr.estimatedCost.min + curr.estimatedCost.max) / 2);
        }
        return acc;
    }, 0);

    return [
      {
        title: "Total Projects",
        value: projects.length,
        icon: Briefcase,
        desc: "Active portfolio items"
      },
      {
        title: "Total Estimates",
        value: estimates.length,
        icon: FileText,
        desc: "Generated via estimator"
      },
      {
        title: "Testimonials",
        value: testimonials.length,
        icon: MessageSquare,
        desc: "Client reviews"
      },
      {
        title: "Est. Pipeline Value",
        value: `$${(totalProjectValue / 1000).toFixed(1)}k`,
        icon: DollarSign,
        desc: "Based on estimates"
      }
    ];
  }, [projects, estimates, testimonials]);

  // Chart Data: Projects by Category
  const categoryData = useMemo(() => {
    const counts = {};
    projects.forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [projects]);

  // Chart Data: Estimates by Room Type
  const estimateTypeData = useMemo(() => {
    const counts = {};
    estimates.forEach(e => {
      counts[e.roomType] = (counts[e.roomType] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [estimates]);

  const isLoading = isLoadingProjects || isLoadingEstimates || isLoadingTestimonials;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-red-600 mx-auto mb-4" />
          <p className="text-gray-500">Loading dashboard analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Admin Dashboard</h1>
            <p className="text-gray-500 mt-1">Overview of your application's performance and data.</p>
          </div>
          <div className="flex gap-3">
             <Button variant="outline" asChild>
                <Link to={createPageUrl('Home')}>View Live Site</Link>
             </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <Card key={i} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-gray-500 mt-1">{stat.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid gap-4 md:grid-cols-2">
          
          {/* Estimate Trends */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Estimate Requests</CardTitle>
              <CardDescription>Breakdown by room type</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              {estimateTypeData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={estimateTypeData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                        dataKey="name" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false}
                        tickFormatter={(value) => value.split(' ')[0]} 
                    />
                    <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip 
                        cursor={{ fill: '#f3f4f6' }}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="value" fill="#dc2626" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                    No estimate data available yet
                </div>
              )}
            </CardContent>
          </Card>

          {/* Project Categories */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Project Portfolio</CardTitle>
              <CardDescription>Distribution by category</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                    No project data available
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Estimates Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Estimates</CardTitle>
            <CardDescription>Latest 5 estimates generated by users</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Client Name</TableHead>
                  <TableHead>Room Type</TableHead>
                  <TableHead>Est. Value</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {estimates.length > 0 ? (
                  estimates.slice(0, 5).map((estimate) => (
                    <TableRow key={estimate.id}>
                      <TableCell className="font-medium">
                        {new Date(estimate.created_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{estimate.userName || 'Anonymous'}</TableCell>
                      <TableCell>{estimate.roomType}</TableCell>
                      <TableCell>
                        {estimate.estimatedCost?.min ? 
                            `$${estimate.estimatedCost.min.toLocaleString()} - $${estimate.estimatedCost.max.toLocaleString()}` 
                            : 'Pending'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={estimate.status === 'completed' ? 'default' : 'secondary'}>
                          {estimate.status || 'Draft'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      No estimates found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}