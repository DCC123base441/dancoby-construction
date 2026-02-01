import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import AdminLayout from '../components/admin/AdminLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Mail, Phone, Calendar, MessageSquare, Trash2 } from 'lucide-react';
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

export default function AdminLeads() {
    const [isResetting, setIsResetting] = React.useState(false);
    const queryClient = useQueryClient();

    const handleReset = async () => {
        setIsResetting(true);
        try {
            await base44.functions.invoke('resetAnalytics', { target: 'leads' });
            queryClient.invalidateQueries({ queryKey: ['leads'] });
        } catch (error) {
            console.error("Failed to reset leads", error);
        } finally {
            setIsResetting(false);
        }
    };

    const { data: leads = [], isLoading } = useQuery({
        queryKey: ['leads'],
        queryFn: () => base44.entities.Lead.list('-created_date'),
    });

    const updateStatusMutation = useMutation({
        mutationFn: ({id, status}) => base44.entities.Lead.update(id, { status }),
        onSuccess: () => {
            queryClient.invalidateQueries(['leads']);
            toast.success("Status updated");
        }
    });

    const getStatusColor = (status) => {
        switch(status) {
            case 'new': return 'bg-blue-100 text-blue-800';
            case 'contacted': return 'bg-amber-100 text-amber-800';
            case 'qualified': return 'bg-purple-100 text-purple-800';
            case 'won': return 'bg-green-100 text-green-800';
            case 'lost': return 'bg-slate-100 text-slate-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AdminLayout 
            title="Lead Management"
            actions={
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="outline" className="bg-white text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Reset Leads
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Reset All Leads?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will permanently delete all leads. This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleReset} className="bg-red-600 hover:bg-red-700">
                                {isResetting ? "Resetting..." : "Yes, Delete All"}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            }
        >
            <div className="grid gap-4">
                {leads.map((lead) => (
                    <Card key={lead.id} className="overflow-hidden">
                        <div className="p-6">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="font-bold text-lg text-slate-900">{lead.name}</h3>
                                        <Badge variant="outline" className={getStatusColor(lead.status)}>
                                            {lead.status}
                                        </Badge>
                                    </div>
                                    <div className="text-sm text-slate-500 flex flex-wrap gap-4">
                                        <div className="flex items-center gap-1.5">
                                            <Mail className="w-3.5 h-3.5" />
                                            {lead.email}
                                        </div>
                                        {lead.phone && (
                                            <div className="flex items-center gap-1.5">
                                                <Phone className="w-3.5 h-3.5" />
                                                {lead.phone}
                                            </div>
                                        )}
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {new Date(lead.created_date).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>

                                <Select 
                                    defaultValue={lead.status} 
                                    onValueChange={(val) => updateStatusMutation.mutate({id: lead.id, status: val})}
                                >
                                    <SelectTrigger className="w-[140px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="new">New</SelectItem>
                                        <SelectItem value="contacted">Contacted</SelectItem>
                                        <SelectItem value="qualified">Qualified</SelectItem>
                                        <SelectItem value="won">Won</SelectItem>
                                        <SelectItem value="lost">Lost</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-600">
                                <div className="font-medium text-slate-900 mb-1 flex items-center gap-2">
                                    <MessageSquare className="w-3.5 h-3.5" />
                                    Message / Notes
                                </div>
                                {lead.notes || "No notes provided."}
                            </div>
                        </div>
                    </Card>
                ))}
                
                {leads.length === 0 && !isLoading && (
                    <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-xl border border-dashed">
                        No leads found.
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}