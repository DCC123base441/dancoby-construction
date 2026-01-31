import React from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

export default function AdminAnalytics() {
    const visitorData = [
        { name: 'Jan 1', visitors: 120 },
        { name: 'Jan 5', visitors: 132 },
        { name: 'Jan 10', visitors: 101 },
        { name: 'Jan 15', visitors: 134 },
        { name: 'Jan 20', visitors: 190 },
        { name: 'Jan 25', visitors: 230 },
        { name: 'Jan 30', visitors: 210 },
    ];

    const sourceData = [
        { name: 'Google Search', value: 400 },
        { name: 'Direct', value: 300 },
        { name: 'Social Media', value: 300 },
        { name: 'Referral', value: 200 },
    ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return (
        <AdminLayout title="Analytics">
            <div className="grid gap-8 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Visitor Growth (30 Days)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={visitorData}>
                                    <defs>
                                        <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="visitors" stroke="#ef4444" fillOpacity={1} fill="url(#colorVisitors)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Traffic Sources</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={sourceData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {sourceData.map((entry, index) => (
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
            </div>
        </AdminLayout>
    );
}