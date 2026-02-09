import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '../utils';
import { Loader2, FolderKanban, Phone, Mail } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import PortalHeader from '../components/portal/PortalHeader';
import PortalProjectCard from '../components/portal/ProjectCard';
import ProjectUpdates from '../components/portal/ProjectUpdates';
import { LanguageProvider, useLanguage } from '../components/portal/LanguageContext';
import LanguageSwitcher from '../components/portal/LanguageSwitcher';

function CustomerPortalContent() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const { t } = useLanguage();

  useEffect(() => {
    const init = async () => {
      try {
        const isAuth = await base44.auth.isAuthenticated();
        if (!isAuth) {
          window.location.href = createPageUrl('PortalLogin');
          return;
        }
        const me = await base44.auth.me();
        if (me.portalRole !== 'customer' && me.role !== 'admin') {
          if (me.portalRole === 'employee') {
            window.location.href = createPageUrl('EmployeePortal');
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
      <PortalHeader user={user} portalType="customer" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex justify-end mb-2">
          <LanguageSwitcher />
        </div>
        {selectedProject ? (
          <ProjectUpdates 
            project={selectedProject} 
            user={user} 
            canPost={false}
            onBack={() => setSelectedProject(null)}
          />
        ) : (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {t('welcomeBack')}, {user?.full_name?.split(' ')[0] || 'there'}
              </h1>
              <p className="text-gray-500 mt-1">{t('projectsHappening')}</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FolderKanban className="w-5 h-5 text-blue-600" />
                {t('yourProjects')}
              </h2>
              {myProjects.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="p-12 text-center text-gray-400">
                    <FolderKanban className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                    <p className="font-medium">{t('noProjectsYet')}</p>
                    <p className="text-sm mt-1">{t('noProjectsDesc')}</p>
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

            <Card className="border-gray-200">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-3">{t('needHelp')}</h3>
                <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                  <a href="tel:+17182229100" className="flex items-center gap-2 hover:text-gray-900">
                    <Phone className="w-4 h-4" /> (718) 222-9100
                  </a>
                  <a href="mailto:info@dancoby.com" className="flex items-center gap-2 hover:text-gray-900">
                    <Mail className="w-4 h-4" /> info@dancoby.com
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CustomerPortal() {
  return (
    <LanguageProvider>
      <CustomerPortalContent />
    </LanguageProvider>
  );
}