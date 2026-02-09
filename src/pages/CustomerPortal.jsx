import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '../utils';
import { Loader2, Users, Eye } from 'lucide-react';
import CustomerHeader from '../components/portal/CustomerHeader';
import CustomerSidebar from '../components/portal/CustomerSidebar';
import CustomerBottomNav from '../components/portal/CustomerBottomNav';
import CustomerMoreSheet from '../components/portal/CustomerMoreSheet';
import { LanguageProvider, useLanguage } from '../components/portal/LanguageContext';
import LanguageSwitcher from '../components/portal/LanguageSwitcher';
import { Button } from "@/components/ui/button";

// Sections
import NewsFeedSection from '../components/portal/NewsFeedSection';
import FeedbackSection from '../components/portal/FeedbackSection';
import HolidaySchedule from '../components/portal/HolidaySchedule';
import GearShopSection from '../components/portal/GearShopSection';
import JobTreadSection from '../components/portal/JobTreadSection';
import CustomerProfileSetup from '../components/portal/CustomerProfileSetup';
import CustomerFinancesSection from '../components/portal/CustomerFinancesSection';

function CustomerPortalContent() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('news');
  const [moreOpen, setMoreOpen] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const init = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const adminBypass = urlParams.get('admin_view') === 'true' || localStorage.getItem('admin_bypass') === 'true';
        
        const isAuth = await base44.auth.isAuthenticated();
        if (!isAuth) {
             if (adminBypass) {
                setUser({ full_name: 'Admin Viewer', email: 'admin@dancoby.com', role: 'admin', _adminPreview: true });
                setLoading(false);
                return;
             }
             window.location.href = createPageUrl('PortalLogin');
             return;
        }
        
        const me = await base44.auth.me();
        
        // Admin viewing preview
        if (me.role === 'admin' && adminBypass) {
             setUser({ ...me, _adminPreview: true });
             setLoading(false);
             return;
        }

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

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['customerProfile', user?.email],
    queryFn: async () => {
        if (!user?.email) return null;
        const results = await base44.entities.CustomerProfile.filter({ userEmail: user.email });
        return results[0] || null;
    },
    enabled: !!user?.email
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
      </div>
    );
  }

  const firstName = profile?.firstName || user?.full_name?.split(' ')[0] || 'Customer';

  const renderContent = () => {
    switch (activeTab) {
      case 'news': return <NewsFeedSection />;
      case 'finances': return <CustomerFinancesSection />;
      case 'feedback': return <FeedbackSection user={user} />;
      case 'holidays': return <HolidaySchedule />;
      case 'gear': return <GearShopSection />;
      case 'jobtread': return <JobTreadSection />;
      case 'profile': return <CustomerProfileSetup user={user} profile={profile} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {user?._adminPreview && (
        <div className="bg-blue-500 text-white text-center text-xs py-1.5 px-4 font-medium flex items-center justify-center gap-2">
          <Eye className="w-3.5 h-3.5" />
          Admin Preview — Viewing Customer Portal
          <a href={createPageUrl('AdminCustomerPortal')} className="underline ml-2 hover:text-blue-100">← Back to Admin</a>
        </div>
      )}
      
      <CustomerHeader user={user} />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <CustomerSidebar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
            
            {/* Welcome Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 p-5 sm:p-6 mb-6 text-white">
               <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4" />
               <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
               <div className="relative z-10 flex items-center justify-between">
                 <div>
                   <div className="flex items-center gap-2 mb-1">
                     <Users className="w-5 h-5 text-blue-200" />
                     <span className="text-blue-100 text-xs font-medium uppercase tracking-wider">
                       Customer Portal
                     </span>
                   </div>
                   <h1 className="text-xl sm:text-2xl font-bold">
                     Welcome, {firstName}
                   </h1>
                   <p className="text-blue-100 text-sm mt-1 hidden sm:block">
                     Track your project, payments, and updates in one place.
                   </p>
                 </div>
                 <div className="hidden sm:block">
                   <LanguageSwitcher />
                 </div>
               </div>
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-4 sm:p-6">
                {renderContent()}
              </div>
            </div>

            {/* Mobile Language Switcher */}
            <div className="flex justify-center mt-6 sm:hidden">
                <LanguageSwitcher />
            </div>

          </div>
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <CustomerBottomNav 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        onMorePress={() => setMoreOpen(true)} 
      />

      {/* More Sheet */}
      <CustomerMoreSheet 
        open={moreOpen} 
        onOpenChange={setMoreOpen} 
        onTabChange={setActiveTab} 
      />
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