import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { format } from 'date-fns';
import { Loader2, Mail, CheckCircle, XCircle } from 'lucide-react';
import { toast } from "sonner";

export default function AdminMerchWaitlist() {
  const queryClient = useQueryClient();

  const { data: waitlist = [], isLoading } = useQuery({
    queryKey: ['merchWaitlist'],
    queryFn: () => base44.entities.MerchandiseWaitlist.list('-created_date'),
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      await base44.entities.MerchandiseWaitlist.update(id, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['merchWaitlist'] });
      toast.success("Status updated");
    },
    onError: () => {
      toast.error("Failed to update status");
    }
  });

  const handleStatusUpdate = (id, status) => {
    updateStatusMutation.mutate({ id, status });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'notified': return 'bg-blue-100 text-blue-800';
      case 'fulfilled': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout title="Merchandise Waitlist">
      <Card>
        <CardHeader>
          <CardTitle>Waitlist Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : waitlist.length === 0 ? (
            <div className="text-center p-8 text-gray-500">
              No waitlist requests found.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {waitlist.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      {format(new Date(item.created_date), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-500">{item.email}</div>
                    </TableCell>
                    <TableCell>{item.productName}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.productSize}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(item.status)}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {item.status === 'pending' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            onClick={() => handleStatusUpdate(item.id, 'notified')}
                          >
                            <Mail className="w-4 h-4 mr-1" />
                            Mark Notified
                          </Button>
                        )}
                        {item.status !== 'fulfilled' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            onClick={() => handleStatusUpdate(item.id, 'fulfilled')}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Done
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}