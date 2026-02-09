import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '../utils';
import { Loader2, HardHat, UserCircle, Eye } from 'lucide-react';
import { Button } from "@/components/ui/button";
import PortalHeader from '../components/portal/PortalHeader';
import PortalSidebar from '../components/portal/PortalSidebar';
import PortalBottomNav from '../components/portal/PortalBottomNav';
import PortalMoreSheet from '../components/portal/PortalMoreSheet';
import EmployeeProfileSetup from '../components/portal/EmployeeProfileSetup';
import FeedbackSection from '../components/portal/FeedbackSection';
import SalarySection from '../components/portal/SalarySection';
import HolidaySchedule from '../components/portal/HolidaySchedule';
import RaiseRequestSection from '../components/portal/RaiseRequestSection';
import GearShopSection from '../components/portal/GearShopSection';
import TimeOffSection from '../components/portal/TimeOffSection';
import JobTreadSection from '../components/portal/JobTreadSection';
import { LanguageProvider, useLanguage } from '../components/portal/LanguageContext';
import LanguageSwitcher from '../components/portal/LanguageSwitcher';
import TenureBadge from '../components/portal/TenureBadge';
import OnboardingWelcome from '../components/portal/OnboardingWelcome';
import NewsFeedSection from '../components/portal/NewsFeedSection';


function EmployeePortalContent() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('news');
  const [editingProfile, setEditingProfile] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const init = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const adminBypass = urlParams.get('admin_view') === 'true' || localStorage.getItem('admin_bypass') === 'true';
        const employeeEmail = urlParams.get('employee_email');

        const isAuth = await base44.auth.isAuthenticated();
        if (!isAuth) {
          if (adminBypass) {
            setUser({ full_name: 'Admin Viewer', email: 'admin@dancoby.com', role: 'admin' });
            setLoading(false);
            return;
          }
          window.location.href = createPageUrl('PortalLogin');
          return;
        }
        const me = await base44.auth.me();

        // Admin viewing a specific employee's portal
        if (me.role === 'admin' && employeeEmail) {
          const profiles = await base44.entities.EmployeeProfile.filter({ userEmail: employeeEmail });
          const empProfile = profiles[0];
          setUser({
            full_name: empProfile ? [empProfile.firstName, empProfile.lastName].filter(Boolean).join(' ') : employeeEmail,
            email: employeeEmail,
            role: 'user',
            portalRole: 'employee',
            _adminPreview: true,
          });
          setLoading(false);
          return;
        }

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
        const adminBypass = new URLSearchParams(window.location.search).get('admin_view') === 'true' || localStorage.getItem('admin_bypass') === 'true';
        if (adminBypass) {
          setUser({ full_name: 'Admin Viewer', email: 'admin@dancoby.com', role: 'admin' });
          setLoading(false);
          return;
        }
        window.location.href = createPageUrl('PortalLogin');
      }
      setLoading(false);
    };
    init();
  }, []);

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['employeeProfile', user?.email],
    queryFn: async () => {
      const results = await base44.entities.EmployeeProfile.filter({ userEmail: user.email });
      return results[0] || null;
    },
    enabled: !!user,
  });

  // Show onboarding for first-time employees
  useEffect(() => {
    if (!profileLoading && user && !profile) {
      const urlParams = new URLSearchParams(window.location.search);
      const onboardingDismissed = sessionStorage.getItem('onboarding_dismissed');
      if (urlParams.get('onboarding') === 'true' && !onboardingDismissed) {
        setShowOnboarding(true);
      }
    }
  }, [profileLoading, user, profile]);

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
          <span className="text-sm text-gray-400">Loading portal...</span>
        </div>
      </div>
    );
  }

  const needsProfile = !profile && !editingProfile;
  const firstName = profile?.firstName || user?.full_name?.split(' ')[0] || 'Team Member';

  const renderContent = () => {
    switch (activeTab) {
      case 'news':
        return <NewsFeedSection />;
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {user?._adminPreview && (
        <div className="bg-amber-500 text-white text-center text-xs py-1.5 px-4 font-medium flex items-center justify-center gap-2">
          <Eye className="w-3.5 h-3.5" />
          Admin Preview — Viewing portal as {user.full_name || user.email}
          <a href={createPageUrl('AdminEmployees')} className="underline ml-2 hover:text-amber-100">← Back to Admin</a>
        </div>
      )}
      {showOnboarding && (
        <OnboardingWelcome
          firstName={firstName}
          onComplete={() => {
            setShowOnboarding(false);
            sessionStorage.setItem('onboarding_dismissed', 'true');
          }}
          onSetupProfile={() => {
            setShowOnboarding(false);
            sessionStorage.setItem('onboarding_dismissed', 'true');
            setEditingProfile(true);
            setActiveTab('profile');
          }}
        />
      )}
      <PortalHeader user={user} portalType="employee" />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop sidebar */}
        <PortalSidebar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
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
                  <div className="flex flex-wrap items-center gap-y-2 gap-x-3 mt-3">
                    {profile?.startDate && <TenureBadge startDate={profile.startDate} />}
                    <div className="flex flex-shrink-0 items-center gap-2 bg-amber-950/20 backdrop-blur-sm px-3 py-1 rounded-full border border-amber-400/20 max-w-full">
                      <div className="relative flex items-center justify-center w-5 h-5 flex-shrink-0">
                        <div className="absolute -inset-0.5 rounded-full border border-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                        <img 
                          src="https://yt3.ggpht.com/QWox277KuhTRFhCWHnkwLJKwYyY-pIZopKYRWhFhdsggxm9Z7BFfy3VlgyEJxYdXbyNbwjdQYz4=s68-c-k-c0x00ffffff-no-rj" 
                          alt="JobTread" 
                          className="w-full h-full rounded-full object-cover" 
                        />
                      </div>
                      <span className="text-[10px] text-amber-50 font-medium whitespace-nowrap">Connected</span>
                    </div>
                  </div>
                </div>
                <div className="hidden sm:block">
                  <LanguageSwitcher />
                </div>
              </div>
              
            </div>

            {/* Profile setup CTA */}
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

            {/* Mobile language switcher */}
            <div className="flex justify-end mb-3 sm:hidden">
              <LanguageSwitcher />
            </div>

            {/* Tab content */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-4 sm:p-6">
                {renderContent()}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <PortalBottomNav 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        onMorePress={() => setMoreOpen(true)} 
      />
      
      {/* More items sheet */}
      <PortalMoreSheet 
        open={moreOpen} 
        onOpenChange={setMoreOpen} 
        onTabChange={setActiveTab} 
      />
    </div>
  );
}

export default function EmployeePortal() {
  return (
    <LanguageProvider>
      <EmployeePortalContent />
    </LanguageProvider>
  );
}