import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { HardHat, UserCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import EmployeeHeader from './EmployeeHeader';
import EmployeeSidebar from './EmployeeSidebar';
import EmployeeBottomNav from './EmployeeBottomNav';
import EmployeeMoreSheet from './EmployeeMoreSheet';
import EmployeeProfileSetup from './EmployeeProfileSetup';
import FeedbackSection from './FeedbackSection';
import SalarySection from './SalarySection';
import HolidaySchedule from './HolidaySchedule';
import RaiseRequestSection from './RaiseRequestSection';
import GearShopSection from './GearShopSection';
import TimeOffSection from './TimeOffSection';
import JobTreadSection from './JobTreadSection';
import { useLanguage } from './LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import TenureBadge from './TenureBadge';
import NewsFeedSection from './NewsFeedSection';
import { useMediaQuery } from "@/components/hooks/use-media-query";
import useNavOrder from './useNavOrder';
import NavCustomizer from './NavCustomizer';

export default function EmployeePortalInner({ user }) {
  const [activeTab, setActiveTab] = useState('news');
  const [editingProfile, setEditingProfile] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const { t } = useLanguage();
  const { order, swapToBottom, reorderBottom, resetOrder } = useNavOrder();

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['employeeProfile', user?.email],
    queryFn: async () => {
      const results = await base44.entities.EmployeeProfile.filter({ userEmail: user.email });
      return results[0] || null;
    },
    enabled: !!user,
  });

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
      </div>
    );
  }

  const needsProfile = !profile && !editingProfile;
  const firstName = profile?.firstName || user?.full_name?.split(' ')[0] || 'Team Member';

  const renderContent = () => {
    switch (activeTab) {
      case 'news': return <NewsFeedSection />;
      case 'profile':
        return profile ? (
          <EmployeeProfileSetup user={user} profile={profile} onSaved={() => {}} />
        ) : (
          <div className="text-center py-16 text-gray-400">
            <UserCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">{t('createProfileHere')}</p>
          </div>
        );
      case 'feedback': return <FeedbackSection user={user} />;
      case 'salary': return <SalarySection profile={profile} />;
      case 'holidays': return <HolidaySchedule />;
      case 'timeoff': return <TimeOffSection user={user} />;
      case 'raise': return <RaiseRequestSection user={user} profile={profile} />;
      case 'gear': return <GearShopSection />;
      case 'jobtread': return <JobTreadSection />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 sm:pb-0">
      <EmployeeHeader user={user} />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex gap-6">
        {/* Sidebar for desktop */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <EmployeeSidebar activeTab={activeTab} onTabChange={setActiveTab} user={user} />
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0 overflow-y-auto lg:pb-0"> {/* Adjusted for scrolling behavior */}
          <div className="max-w-4xl mx-auto"> {/* Removed redundant px-4 sm:px-6 py-6 from here as it's on parent */}
            {/* Welcome banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 p-5 sm:p-6 mb-6 text-white">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <HardHat className="w-5 h-5 text-amber-200" />
                    <span className="text-amber-100 text-xs font-medium uppercase tracking-wider">
                      {t('employeeHub').split('—')[0]}
                    </span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold">
                    {t('welcome')}, {firstName}
                  </h1>
                  <p className="text-amber-100 text-sm mt-1 hidden sm:block">
                    {t('employeeHub')}
                  </p>
                  {profile?.startDate && <TenureBadge startDate={profile.startDate} />}
                </div>
                <div className="hidden sm:block">
                  <LanguageSwitcher />
                </div>
              </div>
            </div>

            {needsProfile && (
              <div className="mb-6 bg-white border border-amber-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <UserCircle className="w-6 h-6 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h2 className="font-semibold text-gray-900">{t('completeProfile')}</h2>
                  <p className="text-sm text-gray-500 mt-0.5">{t('completeProfileDesc')}</p>
                </div>
                <Button onClick={() => setEditingProfile(true)} className="bg-amber-600 hover:bg-amber-700 w-full sm:w-auto">
                  {t('createProfile')}
                </Button>
              </div>
            )}

            {editingProfile && (
              <div className="mb-6">
                <EmployeeProfileSetup user={user} profile={null} onSaved={() => setEditingProfile(false)} />
              </div>
            )}

            <div className="flex justify-end mb-3 sm:hidden">
              <LanguageSwitcher />
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-4 sm:p-6">
                {renderContent()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <EmployeeBottomNav 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        onMorePress={() => setMoreOpen(true)}
        user={user}
        bottomIds={order.bottom}
      />
      
      <EmployeeMoreSheet 
        open={moreOpen} 
        onOpenChange={setMoreOpen} 
        onTabChange={setActiveTab}
        moreIds={order.more}
        onCustomize={() => setCustomizeOpen(true)}
      />

      <NavCustomizer
        open={customizeOpen}
        onOpenChange={setCustomizeOpen}
        order={order}
        swapToBottom={swapToBottom}
        reorderBottom={reorderBottom}
        resetOrder={resetOrder}
      />
    </div>
  );
}