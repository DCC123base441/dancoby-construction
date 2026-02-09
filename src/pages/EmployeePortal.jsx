import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '../utils';
import { Loader2, HardHat, UserCircle, MessageCircle, DollarSign, CalendarDays, HandCoins, ShoppingBag, CalendarOff, MonitorPlay } from 'lucide-react';
import { Button } from "@/components/ui/button";
import PortalHeader from '../components/portal/PortalHeader';
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

function EmployeePortalContent() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [editingProfile, setEditingProfile] = useState(false);
  const { t } = useLanguage();

  const TABS = [
    { id: 'profile', label: t('tabProfile'), icon: UserCircle, color: 'bg-blue-100 text-blue-700 border-blue-300', activeColor: 'bg-blue-600 text-white border-blue-600' },
    { id: 'feedback', label: t('tabFeedback'), icon: MessageCircle, color: 'bg-purple-100 text-purple-700 border-purple-300', activeColor: 'bg-purple-600 text-white border-purple-600' },
    { id: 'salary', label: t('tabSalary'), icon: DollarSign, color: 'bg-emerald-100 text-emerald-700 border-emerald-300', activeColor: 'bg-emerald-600 text-white border-emerald-600' },
    { id: 'holidays', label: t('tabHolidays'), icon: CalendarDays, color: 'bg-red-100 text-red-700 border-red-300', activeColor: 'bg-red-600 text-white border-red-600' },
    { id: 'timeoff', label: t('tabTimeOff') || 'Time Off', icon: CalendarOff, color: 'bg-orange-100 text-orange-700 border-orange-300', activeColor: 'bg-orange-600 text-white border-orange-600' },
    { id: 'raise', label: t('tabRaise'), icon: HandCoins, color: 'bg-amber-100 text-amber-700 border-amber-300', activeColor: 'bg-amber-600 text-white border-amber-600' },
    { id: 'gear', label: t('tabGear'), icon: ShoppingBag, color: 'bg-pink-100 text-pink-700 border-pink-300', activeColor: 'bg-pink-600 text-white border-pink-600' },
    { id: 'jobtread', label: t('tabJobTread'), icon: MonitorPlay, color: 'bg-cyan-100 text-cyan-700 border-cyan-300', activeColor: 'bg-cyan-600 text-white border-cyan-600' },
  ];

  useEffect(() => {
    const init = async () => {
      try {
        // Check if coming from admin dashboard via bypass
        const urlParams = new URLSearchParams(window.location.search);
        const adminBypass = urlParams.get('admin_view') === 'true' || localStorage.getItem('admin_bypass') === 'true';

        const isAuth = await base44.auth.isAuthenticated();
        if (!isAuth) {
          if (adminBypass) {
            // Admin bypass without real auth — show portal with mock admin user
            setUser({ full_name: 'Admin Viewer', email: 'admin@dancoby.com', role: 'admin' });
            setLoading(false);
            return;
          }
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

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  const needsProfile = !profile && !editingProfile;

  return (
    <div className="min-h-screen bg-gray-50">
      <PortalHeader user={user} portalType="employee" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex justify-end mb-2">
          <LanguageSwitcher />
        </div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <HardHat className="w-7 h-7 text-amber-600" />
            {t('welcome')}, {profile?.firstName || user?.full_name?.split(' ')[0] || 'Team Member'}
          </h1>
          <p className="text-gray-500 mt-1">{t('employeeHub')}</p>
        </div>

        {needsProfile && (
          <div className="mb-8 bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
            <UserCircle className="w-10 h-10 text-amber-600 mx-auto mb-3" />
            <h2 className="text-lg font-bold text-gray-900 mb-1">{t('completeProfile')}</h2>
            <p className="text-sm text-gray-500 mb-4">{t('completeProfileDesc')}</p>
            <Button onClick={() => setEditingProfile(true)} className="bg-amber-600 hover:bg-amber-700">
              {t('createProfile')}
            </Button>
          </div>
        )}

        {editingProfile && (
          <div className="mb-8">
            <EmployeeProfileSetup user={user} profile={null} onSaved={() => setEditingProfile(false)} />
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-6">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg border transition-all ${
                activeTab === tab.id
                  ? tab.activeColor + ' shadow-sm'
                  : tab.color + ' hover:opacity-80'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div>
          {activeTab === 'profile' && (
            profile ? (
              <EmployeeProfileSetup user={user} profile={profile} onSaved={() => {}} />
            ) : (
              <div className="text-center py-12 text-gray-400">
                <UserCircle className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                <p>{t('createProfileHere')}</p>
              </div>
            )
          )}
          {activeTab === 'feedback' && <FeedbackSection user={user} />}
          {activeTab === 'salary' && <SalarySection profile={profile} />}
          {activeTab === 'holidays' && <HolidaySchedule />}
          {activeTab === 'timeoff' && <TimeOffSection user={user} />}
          {activeTab === 'raise' && <RaiseRequestSection user={user} profile={profile} />}
          {activeTab === 'gear' && <GearShopSection />}
          {activeTab === 'jobtread' && <JobTreadSection />}
        </div>
      </div>
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