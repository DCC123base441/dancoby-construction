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

  useEffect(() => {
    if (reviews.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 6000); // Rotate every 6 seconds

    return () => clearInterval(interval);
  }, [reviews.length]);

  if (reviews.length === 0) return null;

  const currentReview = reviews[currentIndex];

  return (
    <div className="mt-6 pt-6 border-t border-white/20">
      <div className="flex items-center gap-2 mb-3">
        <Star className="w-4 h-4 text-amber-200 fill-amber-200" />
        <h3 className="text-xs font-bold uppercase tracking-wider text-amber-100">
          What customers are saying
        </h3>
      </div>
      
      <div className="relative min-h-[80px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-2"
          >
            <div className="flex gap-3">
              <Quote className="w-8 h-8 text-amber-200/40 flex-shrink-0 -mt-1 transform scale-x-[-1]" />
              <div>
                <p className="text-white font-medium text-lg leading-snug italic">
                  "{currentReview.quote}"
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-amber-100 text-sm font-semibold">— {currentReview.client_name}</span>
                  {currentReview.role && (
                    <>
                      <span className="text-amber-200/50">•</span>
                      <span className="text-amber-200 text-xs">{currentReview.role}</span>
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
        <div className="flex gap-1.5 mt-4">
          {reviews.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1 rounded-full transition-all duration-300 ${
                idx === currentIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Go to review ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}