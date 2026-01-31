import React, { useState } from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Search, 
  MoreHorizontal, 
  Mail, 
  Phone, 
  MessageSquare,
  Filter,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminLeads() {
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  // Fetch Leads (Estimates for now + Manual Leads)
  const { data: estimates } = useQuery({
    queryKey: ['estimates'],
    queryFn: () => base44.entities.Estimate.list('-created_date'),
    initialData: []
  });

  const { data: leads } = useQuery({
    queryKey: ['leads'],
    queryFn: () => base44.entities.Lead.list('-created_date'),
    initialData: []
  });

  // Combine data for view
  // We'll treat Estimates as "Qualified Leads"
  const allLeads = [
    ...estimates.map(e => ({
      id: e.id,
      name: e.userName || 'Unknown',
      email: e.userEmail,
      source: 'Online Estimator',
      status: e.status || 'new', // draft, completed, sent
      type: 'estimate',
      details: `${e.roomType} Renovation`,
      date: e.created_date
    })),
    ...leads.map(l => ({
      id: l.id,
      name: l.name,
      email: l.email,
      source: l.source || 'Contact Form',
      status: l.status || 'new',
      type: 'lead',
      details: l.message,
      date: l.created_date
    }))
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  const filteredLeads = allLeads.filter(l => 
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'new': case 'draft': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'contacted': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'completed': case 'won': return 'bg-green-50 text-green-700 border-green-200';
      case 'lost': return 'bg-gray-50 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Leads & Estimates</h1>
          <p className="text-gray-500 mt-2">Track inquiries and potential clients.</p>
        </div>
        <Button className="bg-red-600 hover:bg-red-700">
          <Plus className="w-5 h-5 mr-2" />
          Add Lead Manually
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input 
              placeholder="Search leads by name or email..." 
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-10 gap-2">
              <Filter className="w-4 h-4" />
              Filter Status
            </Button>
            <Button variant="outline" size="sm" className="h-10 gap-2">
              Export CSV
            </Button>
          </div>
        </div>

        {/* Table */}
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead>Contact Name</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLeads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-gray-500">
                  <div className="flex flex-col items-center gap-2">
                    <Users className="w-8 h-8 text-gray-300" />
                    <p>No leads found matching your search.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredLeads.map((lead) => (
                <TableRow key={`${lead.type}-${lead.id}`}>
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-900">{lead.name}</div>
                      <div className="text-sm text-gray-500">{lead.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-normal">
                      {lead.source}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate" title={lead.details}>
                    {lead.details || '-'}
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(lead.status)}`}>
                      {lead.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-500 text-sm">
                    {new Date(lead.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Mail className="w-4 h-4 mr-2" /> Email
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Phone className="w-4 h-4 mr-2" /> Call
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" /> Mark Won
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <XCircle className="w-4 h-4 mr-2 text-red-600" /> Mark Lost
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
}

// Import helper
import { Plus, Users } from 'lucide-react';