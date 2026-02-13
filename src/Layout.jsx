import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ChatBot from './components/ChatBot';
import MobileQuickActions from './components/MobileQuickActions';
import InstagramFollowNotification from './components/InstagramFollowNotification';
import FloatingCTA from './components/FloatingCTA';
import BackToTop from './components/BackToTop';
import ScrollProgress from './components/ScrollProgress';
import CookieConsent from './components/CookieConsent';

import { base44 } from '@/api/base44Client';
import { createPageUrl } from './utils';

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const isPortal = currentPageName === 'EmployeePortal' || currentPageName === 'CustomerPortal' || currentPageName === 'PortalLogin';
  const isAdmin = currentPageName?.startsWith('Admin');

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Auto-redirect logged-in portal users from home page to portal
    if (location.pathname === '/' && !isAdmin && !isPortal) {
        const checkRedirect = async () => {
            try {
                const isAuth = await base44.auth.isAuthenticated();
                if (isAuth) {
                    const user = await base44.auth.me();
                    // Check portal access via backend to handle permissions and auto-assignment
                    try {
                        const { data } = await base44.functions.invoke('checkPortalAccess');
                        if (data.authorized && data.role) {
                            window.location.href = createPageUrl('PortalLogin');
                        }
                    } catch (err) {
                        console.error('Failed to check portal access', err);
                    }
                }
            } catch (e) {
                // Not logged in or error, stay on home page
            }
        };
        checkRedirect();
    }
    
    // Track site visit
    const trackVisit = async () => {
        try {
            // Use backend function to enrich with location data
            await base44.functions.invoke('trackVisit', {
                page: location.pathname,
                userAgent: navigator.userAgent,
                referrer: document.referrer
            });
        } catch (error) {
            // Fallback to direct creation if function fails
            try {
                await base44.entities.SiteVisit.create({
                    page: location.pathname,
                    userAgent: navigator.userAgent,
                    referrer: document.referrer
                });
            } catch (e) {
                console.warn('Failed to track visit', e);
            }
        }
    };
    
    trackVisit();
  }, [location.pathname, isAdmin, isPortal]);

  if (isPortal || isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollProgress />
      <Header />
      <main className="flex-1 pt-20">
        {children}
      </main>
      <Footer />
      <MobileQuickActions />
              <ChatBot />
              <InstagramFollowNotification />
      <FloatingCTA />
      <BackToTop />
          <CookieConsent />

    </div>
  );
}