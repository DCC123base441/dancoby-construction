import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie_consent', 'declined');
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6"
        >
          <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-xl shadow-2xl p-5 md:p-6">
            <div className="flex items-start gap-4">
              <div className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-stone-100 flex-shrink-0 mt-0.5">
                <Cookie className="w-5 h-5 text-stone-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-900 mb-1">We Value Your Privacy</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  We use cookies to enhance your browsing experience, analyze site traffic, and support essential site functionality. 
                  By clicking "Accept," you consent to our use of cookies. Read our{' '}
                  <Link to={createPageUrl('PrivacyPolicy')} className="text-red-600 hover:text-red-700 underline underline-offset-2">
                    Privacy Policy
                  </Link>{' '}
                  for more information.
                </p>
              </div>
              <button onClick={handleDecline} className="text-gray-400 hover:text-gray-600 md:hidden flex-shrink-0">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center justify-end gap-3 mt-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDecline}
                className="text-xs tracking-wide"
              >
                Decline
              </Button>
              <Button 
                size="sm" 
                onClick={handleAccept}
                className="bg-gray-900 hover:bg-gray-800 text-white text-xs tracking-wide"
              >
                Accept All Cookies
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}