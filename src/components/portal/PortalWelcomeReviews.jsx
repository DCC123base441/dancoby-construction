import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Quote, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PortalWelcomeReviews() {
  const [reviews, setReviews] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // Fetch published testimonials
        const data = await base44.entities.Testimonial.list('-order', 10);
        if (data && data.length > 0) {
          setReviews(data);
        }
      } catch (error) {
        console.error("Failed to fetch reviews", error);
      }
    };
    fetchReviews();
  }, []);



  if (reviews.length === 0) return null;

  const currentReview = reviews[currentIndex];

  return (
    <div className="mt-8 relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 p-6 text-white shadow-lg">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
              <Quote className="w-4 h-4 text-amber-400" />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              What customers are saying
            </h3>
          </div>
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
            ))}
          </div>
        </div>
        
        <div className="relative min-h-[100px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col gap-3"
            >
              <div className="flex gap-4">
                <Quote className="w-8 h-8 text-amber-500 flex-shrink-0 -mt-1 transform scale-x-[-1]" />
                <div>
                  <p className="text-white/90 font-medium text-lg leading-relaxed italic">
                    "{currentReview.quote}"
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-amber-400 font-semibold">— {currentReview.client_name}</span>
                    {currentReview.role && (
                      <>
                        <span className="text-slate-600">•</span>
                        <span className="text-slate-400 text-sm">{currentReview.role}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Indicators */}
        {reviews.length > 1 && (
          <div className="flex justify-end gap-1.5 mt-2">
            {reviews.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? 'w-6 bg-amber-500' : 'w-1.5 bg-slate-700 hover:bg-slate-600'
                }`}
                aria-label={`Go to review ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}