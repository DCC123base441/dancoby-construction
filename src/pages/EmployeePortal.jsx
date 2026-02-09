import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '../utils';
import { Loader2, HardHat, UserCircle, MessageCircle, DollarSign, CalendarDays, HandCoins, ShoppingBag } from 'lucide-react';
import { Button } from "@/components/ui/button";
import PortalHeader from '../components/portal/PortalHeader';
import EmployeeProfileSetup from '../components/portal/EmployeeProfileSetup';
import FeedbackSection from '../components/portal/FeedbackSection';
import SalarySection from '../components/portal/SalarySection';
import HolidaySchedule from '../components/portal/HolidaySchedule';
import RaiseRequestSection from '../components/portal/RaiseRequestSection';
import GearShopSection from '../components/portal/GearShopSection';
import { LanguageProvider, useLanguage } from '../components/portal/LanguageContext';

function EmployeePortalContent() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [editingProfile, setEditingProfile] = useState(false);
  const { t } = useLanguage();

  const TABS = [
    { id: 'profile', label: t('tabProfile'), icon: UserCircle },
    { id: 'feedback', label: t('tabFeedback'), icon: MessageCircle },
    { id: 'salary', label: t('tabSalary'), icon: DollarSign },
    { id: 'holidays', label: t('tabHolidays'), icon: CalendarDays },
    { id: 'raise', label: t('tabRaise'), icon: HandCoins },
    { id: 'gear', label: t('tabGear'), icon: ShoppingBag },
  ];

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
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <HardHat className="w-7 h-7 text-amber-600" />
            {t('welcome')}, {user?.full_name?.split(' ')[0] || 'Team Member'}
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

        <div className="flex gap-1 overflow-x-auto pb-1 mb-6 border-b border-gray-200">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-all -mb-[1px] ${
                activeTab === tab.id
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
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
          {activeTab === 'raise' && <RaiseRequestSection user={user} profile={profile} />}
          {activeTab === 'gear' && <GearShopSection />}
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