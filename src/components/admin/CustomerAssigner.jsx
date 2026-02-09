import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserPlus, X, Users } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export default function CustomerAssigner({ projectId, open, onOpenChange }) {
  const queryClient = useQueryClient();

  const { data: allUsers = [] } = useQuery({
    queryKey: ['allUsers'],
    queryFn: () => base44.entities.User.list(),
    enabled: open,
  });

  // Customers and employees
  const portalUsers = allUsers.filter(u => u.portalRole === 'customer' || u.portalRole === 'employee');
  
  const assignedUsers = portalUsers.filter(u => (u.assignedProjects || []).includes(projectId));
  const unassignedUsers = portalUsers.filter(u => !(u.assignedProjects || []).includes(projectId));

  const assignMutation = useMutation({
    mutationFn: async (userId) => {
      const user = allUsers.find(u => u.id === userId);
      const current = user.assignedProjects || [];
      await base44.entities.User.update(userId, {
        assignedProjects: [...current, projectId]
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['allUsers']);
      toast.success('User assigned to project');
    },
  });

  const unassignMutation = useMutation({
    mutationFn: async (userId) => {
      const user = allUsers.find(u => u.id === userId);
      const current = user.assignedProjects || [];
      await base44.entities.User.update(userId, {
        assignedProjects: current.filter(id => id !== projectId)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['allUsers']);
      toast.success('User removed from project');
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Assign People to Project
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Currently Assigned */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Assigned ({assignedUsers.length})</p>
            {assignedUsers.length === 0 ? (
              <p className="text-sm text-gray-400 italic">No one assigned yet</p>
            ) : (
              <div className="space-y-2">
                {assignedUsers.map(user => (
                  <div key={user.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600">
                        {(user.full_name || user.email)?.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user.full_name || user.email}</p>
                        <Badge variant="outline" className="text-[10px] capitalize">{user.portalRole}</Badge>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 text-gray-400 hover:text-red-500"
                      onClick={() => unassignMutation.mutate(user.id)}
                      disabled={unassignMutation.isPending}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Available to Assign */}
          {unassignedUsers.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Available to Assign</p>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {unassignedUsers.map(user => (
                  <div key={user.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-500">
                        {(user.full_name || user.email)?.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user.full_name || user.email}</p>
                        <Badge variant="outline" className="text-[10px] capitalize">{user.portalRole}</Badge>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="h-7 text-xs"
                      onClick={() => assignMutation.mutate(user.id)}
                      disabled={assignMutation.isPending}
                    >
                      <UserPlus className="w-3 h-3 mr-1" />
                      Assign
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {portalUsers.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">
              No customers or employees have been set up yet. Invite users and set their portal role first.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}