import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Instagram, X, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function InstagramFollowPopup({ isOpen, onClose }) {
  const instagramUrl = "https://www.instagram.com/dancobyconstruction";

  const handleFollow = () => {
    // Open Instagram in background without navigating away
    const newWindow = window.open(instagramUrl, '_blank', 'noopener,noreferrer');
    if (newWindow) newWindow.blur();
    window.focus();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-50"
          />
          
          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-10"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>

            {/* Content */}
            <div className="p-6 pt-8 text-center">
              {/* Instagram gradient icon */}
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center">
                <Instagram className="w-10 h-10 text-white" />
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Follow Us on Instagram
              </h3>
              <p className="text-gray-500 text-sm mb-6">
                @dancobyconstruction
              </p>

              {/* Preview images */}
              <div className="flex justify-center gap-2 mb-6">
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697c18d2dbda3b3101bfe937/99a553c33_Dancoby_PenthouseFinished_Shot9.jpg"
                  alt="Project 1"
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697c18d2dbda3b3101bfe937/7606e7773_Dancoby_PenthouseFinished_Shot20-V2.jpg"
                  alt="Project 2"
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697c18d2dbda3b3101bfe937/484896910_Dancoby_849Central_15.jpg"
                  alt="Project 3"
                  className="w-20 h-20 object-cover rounded-lg"
                />
              </div>

              <Button
                onClick={handleFollow}
                className="w-full bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 hover:from-purple-700 hover:via-pink-600 hover:to-orange-500 text-white font-semibold py-6"
              >
                <Instagram className="w-5 h-5 mr-2" />
                Follow on Instagram
              </Button>

              <p className="text-xs text-gray-400 mt-4">
                Get inspired by our latest projects
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}