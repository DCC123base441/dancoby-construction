import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import AdminLayout from '../components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
    Calculator, 
    Calendar, 
    DollarSign, 
    User, 
    Mail, 
    ImageIcon,
    ArrowRight,
    Search,
    Filter
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function AdminEstimates() {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedEstimate, setSelectedEstimate] = useState(null);

    const { data: estimates = [], isLoading } = useQuery({
        queryKey: ['estimates'],
        queryFn: () => base44.entities.Estimate.list('-created_date'),
    });

    // Stats Calculations
    const totalEstimates = estimates.length;
    const totalValue = estimates.reduce((acc, curr) => acc + (curr.estimatedCost?.min || 0), 0);
    const avgValue = totalEstimates > 0 ? totalValue / totalEstimates : 0;
    
    // Group by room type for quick stats
    const roomTypeStats = estimates.reduce((acc, curr) => {
        acc[curr.roomType] = (acc[curr.roomType] || 0) + 1;
        return acc;
    }, {});

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const filteredEstimates = estimates.filter(est => {
        const matchesSearch = 
            est.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            est.userEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            est.roomType?.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesStatus = statusFilter === "all" || est.status === statusFilter;
        
        return matchesSearch && matchesStatus;
    });

    return (
        <AdminLayout title="Estimator Analytics">
            {/* Top Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3 mb-8">
                <Card className="bg-white border-slate-200 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Total Estimates</CardTitle>
                        <Calculator className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{totalEstimates}</div>
                        <p className="text-xs text-slate-500">Lifetime submissions</p>
                    </CardContent>
                </Card>
                <Card className="bg-white border-slate-200 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Pipeline Value</CardTitle>
                        <DollarSign className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{formatCurrency(totalValue)}</div>
                        <p className="text-xs text-slate-500">Total min. estimated value</p>
                    </CardContent>
                </Card>
                <Card className="bg-white border-slate-200 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Avg. Estimate</CardTitle>
                        <DollarSign className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{formatCurrency(avgValue)}</div>
                        <p className="text-xs text-slate-500">Average project size</p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input 
                        placeholder="Search by name, email, or room..." 
                        className="pl-10 bg-white"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-[200px] bg-white">
                        <SelectValue placeholder="Filter by Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="sent">Sent</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Estimates List */}
            <div className="space-y-4">
                {filteredEstimates.map((estimate) => (
                    <Card key={estimate.id} className="overflow-hidden hover:shadow-md transition-shadow">
                        <div className="p-6 flex flex-col md:flex-row gap-6">
                            {/* Images Preview */}
                            <div className="flex gap-2 shrink-0">
                                <div className="w-32 h-24 bg-slate-100 rounded-lg overflow-hidden relative group cursor-pointer" onClick={() => setSelectedEstimate(estimate)}>
                                    {estimate.originalImageUrl ? (
                                        <img src={estimate.originalImageUrl} alt="Original" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                                            <ImageIcon className="w-6 h-6" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-xs text-white font-medium">Original</span>
                                    </div>
                                </div>
                                {estimate.visualizedImageUrl && (
                                    <div className="w-32 h-24 bg-slate-100 rounded-lg overflow-hidden relative group cursor-pointer" onClick={() => setSelectedEstimate(estimate)}>
                                        <img src={estimate.visualizedImageUrl} alt="Render" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="text-xs text-white font-medium">AI Render</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Details */}
                            <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="font-semibold text-lg text-slate-900">{estimate.roomType} Renovation</h3>
                                        <Badge variant="outline" className="capitalize">{estimate.status}</Badge>
                                    </div>
                                    <div className="space-y-1 text-sm text-slate-500">
                                        <div className="flex items-center gap-2">
                                            <User className="w-3.5 h-3.5" /> {estimate.userName || 'Anonymous'}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Mail className="w-3.5 h-3.5" /> {estimate.userEmail || 'No email provided'}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-3.5 h-3.5" /> {new Date(estimate.created_date).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Estimated Cost</div>
                                    <div className="text-xl font-bold text-slate-900">
                                        {estimate.estimatedCost?.min ? (
                                            `${formatCurrency(estimate.estimatedCost.min)} - ${formatCurrency(estimate.estimatedCost.max)}`
                                        ) : (
                                            'Pending Calculation'
                                        )}
                                    </div>
                                    {estimate.squareFootageEstimate && (
                                        <div className="text-sm text-slate-500">
                                            ~{estimate.squareFootageEstimate} sq. ft. estimated
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center justify-end">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" className="gap-2" onClick={() => setSelectedEstimate(estimate)}>
                                                View Full Details <ArrowRight className="w-4 h-4" />
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                            <DialogHeader>
                                                <DialogTitle>Estimate Details</DialogTitle>
                                            </DialogHeader>
                                            <div className="grid md:grid-cols-2 gap-8 mt-4">
                                                <div className="space-y-6">
                                                    <div>
                                                        <h4 className="font-medium mb-3">Project Imagery</h4>
                                                        <div className="grid gap-4">
                                                            <div className="space-y-2">
                                                                <span className="text-sm text-slate-500">Original Space</span>
                                                                <div className="rounded-lg overflow-hidden border border-slate-200 aspect-video bg-slate-50">
                                                                    {selectedEstimate?.originalImageUrl ? (
                                                                        <img src={selectedEstimate.originalImageUrl} className="w-full h-full object-cover" />
                                                                    ) : (
                                                                        <div className="flex items-center justify-center h-full text-slate-400">No image</div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="space-y-2">
                                                                <span className="text-sm text-slate-500">AI Visualization</span>
                                                                <div className="rounded-lg overflow-hidden border border-slate-200 aspect-video bg-slate-50">
                                                                    {selectedEstimate?.visualizedImageUrl ? (
                                                                        <img src={selectedEstimate.visualizedImageUrl} className="w-full h-full object-cover" />
                                                                    ) : (
                                                                        <div className="flex items-center justify-center h-full text-slate-400">Not generated</div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-6">
                                                    <div>
                                                        <h4 className="font-medium mb-3">Client Information</h4>
                                                        <div className="bg-slate-50 p-4 rounded-lg space-y-2 text-sm">
                                                            <div className="grid grid-cols-3 gap-2">
                                                                <span className="text-slate-500">Name:</span>
                                                                <span className="col-span-2 font-medium">{selectedEstimate?.userName}</span>
                                                            </div>
                                                            <div className="grid grid-cols-3 gap-2">
                                                                <span className="text-slate-500">Email:</span>
                                                                <span className="col-span-2 font-medium">{selectedEstimate?.userEmail}</span>
                                                            </div>
                                                            <div className="grid grid-cols-3 gap-2">
                                                                <span className="text-slate-500">Date:</span>
                                                                <span className="col-span-2 font-medium">{new Date(selectedEstimate?.created_date).toLocaleString()}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <h4 className="font-medium mb-3">Cost Breakdown</h4>
                                                        {selectedEstimate?.estimatedCost?.breakdown ? (
                                                            <div className="space-y-2">
                                                                {Object.entries(selectedEstimate.estimatedCost.breakdown).map(([category, cost]) => (
                                                                    <div key={category} className="flex justify-between text-sm py-2 border-b border-slate-100 last:border-0">
                                                                        <span className="capitalize text-slate-600">{category.replace(/([A-Z])/g, ' $1').trim()}</span>
                                                                        <span className="font-medium">{formatCurrency(cost)}</span>
                                                                    </div>
                                                                ))}
                                                                <div className="flex justify-between text-sm py-3 font-bold text-slate-900 border-t border-slate-200 mt-2">
                                                                    <span>Total Estimate</span>
                                                                    <span>
                                                                        {formatCurrency(selectedEstimate.estimatedCost.min)} - {formatCurrency(selectedEstimate.estimatedCost.max)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <p className="text-sm text-slate-500 italic">No breakdown available.</p>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <h4 className="font-medium mb-3">Selected Finishes</h4>
                                                        {selectedEstimate?.selectedFinishes ? (
                                                            <div className="flex flex-wrap gap-2">
                                                                {Object.entries(selectedEstimate.selectedFinishes).map(([key, value]) => (
                                                                    <Badge key={key} variant="secondary" className="font-normal">
                                                                        {key}: {value}
                                                                    </Badge>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <p className="text-sm text-slate-500 italic">No finishes selected.</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
                
                {filteredEstimates.length === 0 && !isLoading && (
                    <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                        <Calculator className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                        <h3 className="text-sm font-medium text-slate-900">No estimates found</h3>
                        <p className="text-sm text-slate-500">Try adjusting your search or filters.</p>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}