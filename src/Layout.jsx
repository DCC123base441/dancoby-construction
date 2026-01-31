import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ChatBot from './components/ChatBot';
import { base44 } from '@/api/base44Client';

export default function Layout({ children }) {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Track site visit
    const trackVisit = async () => {
        try {
            await base44.entities.SiteVisit.create({
                page: location.pathname,
                userAgent: navigator.userAgent,
                referrer: document.referrer
            });
        } catch (error) {
            // Silently fail for analytics
            console.warn('Failed to track visit', error);
        }
    };
    
    trackVisit();
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-20">
        {children}
      </main>
      <Footer />
      <ChatBot />
    </div>
  );
}