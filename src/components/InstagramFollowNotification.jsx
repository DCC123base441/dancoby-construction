import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Instagram, X } from 'lucide-react';

export default function InstagramFollowNotification() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if already shown this session
    const alreadyShown = sessionStorage.getItem('ig_notification_shown');
    if (alreadyShown) return;

    // Show after random delay between 15-45 seconds
    const delay = Math.random() * 30000 + 15000;
    const timer = setTimeout(() => {
      setIsVisible(true);
      sessionStorage.setItem('ig_notification_shown', 'true');
    }, delay);

    return () => clearTimeout(timer);
  }, []);

  const handleFollow = () => {
    window.open('https://www.instagram.com/dancobyconstruction', '_blank', 'noopener,noreferrer');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 100, y: 0 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-32 md:bottom-24 left-4 md:left-auto md:right-4 z-40 bg-white rounded-xl shadow-lg border border-gray-100 p-3 flex items-center gap-3 max-w-[280px]"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center flex-shrink-0">
            <Instagram className="w-5 h-5 text-white" />
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500">@dancobyconstruction</p>
            <p className="text-sm font-medium text-gray-900 truncate">Follow for inspiration</p>
          </div>

          <button
            onClick={handleFollow}
            className="px-3 py-1.5 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white text-xs font-semibold rounded-lg hover:opacity-90 transition-opacity flex-shrink-0"
          >
            Follow
          </button>

          <button
            onClick={() => setIsVisible(false)}
            className="absolute -top-2 -right-2 w-5 h-5 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center"
          >
            <X className="w-3 h-3 text-gray-500" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}