import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, Clock, User } from 'lucide-react';

export default function AdminTrainingProgress({ courses }) {
  const { data: users = [] } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: () => base44.entities.User.list(),
  });

  const { data: profiles = [] } = useQuery({
    queryKey: ['adminProfiles'],
    queryFn: () => base44.entities.EmployeeProfile.list(),
  });

  const { data: allResources = [] } = useQuery({
    queryKey: ['adminAllResources'],
    queryFn: () => base44.entities.TrainingResource.list('order', 500),
  });

  const { data: allProgress = [], isLoading } = useQuery({
    queryKey: ['adminAllProgress'],
    queryFn: () => base44.entities.TrainingProgress.list('-created_date', 5000),
  });

  const employees = users.filter(u => u.portalRole === 'employee' || profiles.some(p => p.userEmail === u.email));

  if (isLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>;
  }

  return (
    <Card className="border-slate-200">
      <CardContent className="p-5">
        <h3 className="font-bold text-slate-900 mb-4">Employee Training Progress</h3>
        
        {employees.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-8">No employees found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-2 px-3 text-xs font-semibold text-slate-500">Employee</th>
                  {courses.map(c => (
                    <th key={c.id} className="text-center py-2 px-2 text-xs font-semibold text-slate-500 max-w-[120px]">
                      <span className="truncate block">{c.title}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {employees.map(emp => {
                  const profile = profiles.find(p => p.userEmail === emp.email);
                  const name = profile ? [profile.firstName, profile.lastName].filter(Boolean).join(' ') : emp.full_name || emp.email;

                  return (
                    <tr key={emp.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2">
                          {profile?.profilePicture ? (
                            <img src={profile.profilePicture} alt="" className="w-7 h-7 rounded-full object-cover" />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center">
                              <User className="w-3.5 h-3.5 text-slate-500" />
                            </div>
                          )}
                          <span className="font-medium text-slate-800 text-xs truncate max-w-[140px]">{name}</span>
                        </div>
                      </td>
                      {courses.map(course => {
                        const courseResources = allResources.filter(r => r.courseId === course.id);
                        const completed = courseResources.filter(r =>
                          allProgress.some(p => p.userEmail === emp.email && p.resourceId === r.id && p.status === 'completed')
                        ).length;
                        const total = courseResources.length;
                        const isComplete = total > 0 && completed === total;
                        const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

                        return (
                          <td key={course.id} className="text-center py-2.5 px-2">
                            {total === 0 ? (
                              <span className="text-[10px] text-slate-300">—</span>
                            ) : isComplete ? (
                              <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" />
                            ) : completed > 0 ? (
                              <Badge className="bg-amber-100 text-amber-700 text-[10px]">{pct}%</Badge>
                            ) : (
                              <Clock className="w-4 h-4 text-slate-300 mx-auto" />
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}