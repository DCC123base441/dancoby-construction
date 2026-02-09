import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Shield, Users, TrendingUp } from 'lucide-react';
import { Button } from "@/components/ui/button";
import PortalHeader from './PortalHeader';
import PortalSidebar from './PortalSidebar';
import { useLanguage } from './LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

export default function ManagerPortalInner({ user }) {
  const [activeTab, setActiveTab] = useState('team');
  const { t } = useLanguage();

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['managerProfile', user?.email],
    queryFn: async () => {
      const results = await base44.entities.EmployeeProfile.filter({ userEmail: user.email });
      return results[0] || null;
    },
    enabled: !!user,
  });

  const { data: teamMembers = [] } = useQuery({
    queryKey: ['teamMembers'],
    queryFn: async () => {
      const profiles = await base44.entities.EmployeeProfile.list();
      return profiles.slice(0, 5); // Show first 5 employees
    },
  });

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  const firstName = profile?.firstName || user?.full_name?.split(' ')[0] || 'Manager';

  const renderContent = () => {
    switch (activeTab) {
      case 'team':
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">{t('team') || 'Your Team'}</h2>
            <div className="grid gap-3">
              {teamMembers.map(member => (
                <div key={member.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {[member.firstName, member.lastName].filter(Boolean).join(' ')}
                      </h3>
                      <p className="text-sm text-gray-500">{member.position}</p>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      {member.department || 'General'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'reports':
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">{t('reports') || 'Performance Reports'}</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600">85%</div>
                <p className="text-xs text-gray-600 mt-1">Team Productivity</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600">92%</div>
                <p className="text-xs text-gray-600 mt-1">Satisfaction Score</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-600">4.2</div>
                <p className="text-xs text-gray-600 mt-1">Avg Rating</p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-[600px]">
      <PortalHeader user={user} portalType="manager" />
      
      <div className="flex flex-1 overflow-hidden">
        <PortalSidebar activeTab={activeTab} onTabChange={setActiveTab} />

        <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
            {/* Welcome banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 p-5 sm:p-6 mb-6 text-white">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Shield className="w-5 h-5 text-blue-200" />
                    <span className="text-blue-100 text-xs font-medium uppercase tracking-wider">
                      Manager Dashboard
                    </span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold">
                    Welcome back, {firstName}
                  </h1>
                  <p className="text-blue-100 text-sm mt-1 hidden sm:block">
                    Manage your team and track performance
                  </p>
                </div>
                <div className="hidden sm:block">
                  <LanguageSwitcher />
                </div>
              </div>
            </div>

            <div className="flex justify-end mb-3 sm:hidden">
              <LanguageSwitcher />
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-4 sm:p-6">
                {renderContent()}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}