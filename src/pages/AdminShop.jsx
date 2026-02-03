import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import AdminLayout from '../components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
    ShoppingBag, 
    DollarSign, 
    Eye, 
    TrendingUp, 
    Package,
    RefreshCw,
    AlertCircle
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
import { toast } from "sonner";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const MOCK_PRODUCTS = [
  {
    name: 'Next Level T-Shirt',
    description: 'Premium cotton classic fit t-shirt with our signature logo. Comfortable, durable, and stylish.',
    price: 15.00,
    images: ['https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697c18d2dbda3b3101bfe937/59e798105_T-shirt.jpg'],
    category: 'Apparel',
    sizes: ['M', 'L'],
    inStock: false
  },
  {
    name: 'Champion Hoodie',
    description: 'Ultra-soft fleece hoodie featuring the Dancoby branding. Perfect for colder days.',
    price: 29.00,
    images: ['https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697c18d2dbda3b3101bfe937/fc470c4a1_HoodieBlackBig.jpg'],
    category: 'Apparel',
    sizes: ['M', 'L'],
    inStock: false
  },
  {
    name: 'Dancoby Trucker Hat',
    description: 'Classic mesh back trucker hat with embroidered logo. Adjustable snapback closure.',
    price: 25.00,
    images: ['https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697c18d2dbda3b3101bfe937/28bf19810_image.jpg'],
    category: 'Accessories',
    sizes: ['One Size'],
    inStock: true
  },
  {
    name: 'Worksite Beanie',
    description: 'Warm knit beanie for winter projects. Features a subtle woven label.',
    price: 18.00,
    images: ['https://placehold.co/800x1000/f3f4f6/1c1917?text=Coming+Soon&font=montserrat'],
    category: 'Accessories',
    sizes: ['One Size'],
    inStock: true
  }
];

export default function AdminShop() {
    const queryClient = useQueryClient();

    const { data: products = [] } = useQuery({
        queryKey: ['adminProducts'],
        queryFn: () => base44.entities.Product.list(),
    });

    const updateProductMutation = useMutation({
        mutationFn: ({ id, data }) => base44.entities.Product.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['adminProducts']);
            toast.success("Product updated");
        },
        onError: () => toast.error("Failed to update product")
    });

    const seedProductsMutation = useMutation({
        mutationFn: async () => {
            for (const p of MOCK_PRODUCTS) {
                await base44.entities.Product.create(p);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['adminProducts']);
            toast.success("Products seeded successfully");
        },
        onError: () => toast.error("Failed to seed products")
    });

    const toggleStock = (product) => {
        updateProductMutation.mutate({
            id: product.id,
            data: { inStock: !product.inStock }
        });
    };

    // Calculate analytics
    const totalViews = products.reduce((sum, p) => sum + (p.views || 0), 0);
    const totalSales = products.reduce((sum, p) => sum + (p.sales || 0), 0);
    const totalRevenue = products.reduce((sum, p) => sum + ((p.sales || 0) * p.price), 0);
    const conversionRate = totalViews > 0 ? ((totalSales / totalViews) * 100).toFixed(1) : 0;

    const chartData = products.map(p => ({
        name: p.name,
        views: p.views || 0,
        sales: p.sales || 0
    })).sort((a, b) => b.sales - a.sales);

    return (
        <AdminLayout title="Shop Management">
            <div className="space-y-8">
                {/* Stats */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Revenue (Fake)</CardTitle>
                            <DollarSign className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
                            <p className="text-xs text-muted-foreground">From {totalSales} sales</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Product Views</CardTitle>
                            <Eye className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalViews}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                            <TrendingUp className="h-4 w-4 text-purple-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{conversionRate}%</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Products</CardTitle>
                            <Package className="h-4 w-4 text-amber-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{products.filter(p => p.inStock).length} / {products.length}</div>
                        </CardContent>
                    </Card>
                </div>

                {products.length === 0 && (
                    <Card className="border-amber-200 bg-amber-50">
                        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                            <AlertCircle className="w-8 h-8 text-amber-600 mb-2" />
                            <h3 className="font-semibold text-amber-900">No Products Found</h3>
                            <p className="text-sm text-amber-700 mb-4">Initialize the database with default products to manage stock and view analytics.</p>
                            <Button 
                                onClick={() => seedProductsMutation.mutate()} 
                                disabled={seedProductsMutation.isPending}
                                className="bg-amber-600 hover:bg-amber-700 text-white"
                            >
                                {seedProductsMutation.isPending ? "Seeding..." : "Seed Default Products"}
                            </Button>
                        </CardContent>
                    </Card>
                )}

                <div className="grid gap-8 lg:grid-cols-2">
                    {/* Products Table */}
                    <Card className="lg:col-span-1">
                        <CardHeader>
                            <CardTitle>Inventory Management</CardTitle>
                            <CardDescription>Toggle availability status</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Product</TableHead>
                                        <TableHead>Price</TableHead>
                                        <TableHead>Stats</TableHead>
                                        <TableHead className="text-right">In Stock</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {products.map((product) => (
                                        <TableRow key={product.id}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-3">
                                                    <img src={product.images?.[0]} alt={product.name} className="w-8 h-8 rounded object-cover" />
                                                    <span className="truncate max-w-[150px]">{product.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>${product.price}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-col text-xs text-muted-foreground">
                                                    <span>{product.views || 0} views</span>
                                                    <span>{product.sales || 0} sales</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Switch 
                                                    checked={product.inStock} 
                                                    onCheckedChange={() => toggleStock(product)}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {/* Analytics Chart */}
                    <Card className="lg:col-span-1">
                        <CardHeader>
                            <CardTitle>Performance</CardTitle>
                            <CardDescription>Views vs Sales</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis fontSize={12} tickLine={false} axisLine={false} />
                                        <Tooltip />
                                        <Bar dataKey="views" fill="#94a3b8" radius={[4, 4, 0, 0]} name="Views" />
                                        <Bar dataKey="sales" fill="#ea580c" radius={[4, 4, 0, 0]} name="Sales" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}