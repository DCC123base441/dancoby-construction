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
    
    const trackVisit = async () => {
        try {
            await base44.functions.invoke('trackVisit', {
                page: location.pathname,
                userAgent: navigator.userAgent,
                referrer: document.referrer
            });
        } catch (error) {
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
    <div className="min-h-screen flex flex-col bg-[#faf9f7]">
      <style>{`
        :root {
          --color-cream: #faf9f7;
          --color-warm-white: #f5f3f0;
          --color-stone: #e8e4df;
          --color-taupe: #c4bdb4;
          --color-charcoal: #2d2d2d;
          --color-accent: #8b7355;
        }
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background-color: var(--color-cream);
          color: var(--color-charcoal);
        }
        
        h1, h2, h3, h4, h5, h6 {
          font-family: 'Playfair Display', Georgia, serif;
          font-weight: 400;
          letter-spacing: -0.02em;
        }
        
        .serif {
          font-family: 'Playfair Display', Georgia, serif;
        }
        
        .tracking-wide {
          letter-spacing: 0.1em;
        }
      `}</style>
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <ChatBot />
    </div>
  );
}