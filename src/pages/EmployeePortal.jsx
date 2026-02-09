import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '../utils';
import { Loader2, FolderKanban, ClipboardList, HardHat } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PortalHeader from '../components/portal/PortalHeader';
import PortalProjectCard from '../components/portal/ProjectCard';
import ProjectUpdates from '../components/portal/ProjectUpdates';

export default function EmployeePortal() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        const isAuth = await base44.auth.isAuthenticated();
        if (!isAuth) {
          window.location.href = createPageUrl('PortalLogin');
          return;
        }
        const me = await base44.auth.me();
        if (me.portalRole !== 'employee' && me.role !== 'admin') {
          if (me.portalRole === 'customer') {
            window.location.href = createPageUrl('CustomerPortal');
          } else {
            window.location.href = createPageUrl('PortalLogin');
          }
          return;
        }
        setUser(me);
      } catch {
        window.location.href = createPageUrl('PortalLogin');
      }
      setLoading(false);
    };
    init();
  }, []);

  const { data: allProjects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: () => base44.entities.Project.list(),
    enabled: !!user,
  });

  const { data: currentProjects = [] } = useQuery({
    queryKey: ['currentProjects'],
    queryFn: () => base44.entities.CurrentProject.list(),
    enabled: !!user,
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  const assignedIds = user?.assignedProjects || [];
  const myProjects = allProjects.filter(p => assignedIds.includes(p.id));

  return (
    <div className="min-h-screen bg-gray-50">
      <PortalHeader user={user} portalType="employee" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {selectedProject ? (
          <ProjectUpdates 
            project={selectedProject} 
            user={user} 
            canPost={true}
            onBack={() => setSelectedProject(null)}
          />
        ) : (
          <div className="space-y-8">
            {/* Welcome */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <HardHat className="w-7 h-7 text-amber-600" />
                Welcome, {user?.full_name?.split(' ')[0] || 'Team Member'}
              </h1>
              <p className="text-gray-500 mt-1">Manage your assigned projects and post updates.</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <Card className="border-gray-200">
                <CardContent className="p-5 text-center">
                  <div className="text-2xl font-bold text-gray-900">{myProjects.length}</div>
                  <p className="text-xs text-gray-500 mt-1">Assigned Projects</p>
                </CardContent>
              </Card>
              <Card className="border-gray-200">
                <CardContent className="p-5 text-center">
                  <div className="text-2xl font-bold text-gray-900">{allProjects.length}</div>
                  <p className="text-xs text-gray-500 mt-1">Total Projects</p>
                </CardContent>
              </Card>
              <Card className="border-gray-200 col-span-2 sm:col-span-1">
                <CardContent className="p-5 text-center">
                  <div className="text-2xl font-bold text-gray-900">{currentProjects.length}</div>
                  <p className="text-xs text-gray-500 mt-1">Active Job Sites</p>
                </CardContent>
              </Card>
            </div>

            {/* My Assigned Projects */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-amber-600" />
                My Assigned Projects
              </h2>
              {myProjects.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="p-12 text-center text-gray-400">
                    <FolderKanban className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                    <p className="font-medium">No projects assigned to you yet</p>
                    <p className="text-sm mt-1">Ask your admin to assign projects to you.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {myProjects.map(project => (
                    <PortalProjectCard 
                      key={project.id} 
                      project={project} 
                      onClick={setSelectedProject}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* All Projects (read-only view) */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FolderKanban className="w-5 h-5 text-gray-500" />
                All Company Projects
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {allProjects.map(project => (
                  <PortalProjectCard 
                    key={project.id} 
                    project={project} 
                    onClick={setSelectedProject}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}