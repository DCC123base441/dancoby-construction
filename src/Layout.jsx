import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';
import ChatBot from './components/ChatBot';
import MobileQuickActions from './components/MobileQuickActions';
import InstagramFollowNotification from './components/InstagramFollowNotification';
import PageTransition from './components/PageTransition';
import FloatingCTA from './components/FloatingCTA';
import BackToTop from './components/BackToTop';
import ScrollProgress from './components/ScrollProgress';
import { base44 } from '@/api/base44Client';

export default function Layout({ children }) {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    
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
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollProgress />
      <Header />
      <AnimatePresence mode="wait">
        <PageTransition key={location.pathname}>
          <main className="flex-1 pt-20">
            {children}
          </main>
        </PageTransition>
      </AnimatePresence>
      <Footer />
      <MobileQuickActions />
              <ChatBot />
              <InstagramFollowNotification />
      <FloatingCTA />
      <BackToTop />
    </div>
  );
}