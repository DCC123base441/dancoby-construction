import React, { useRef, useState, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';

export default function CurrentProjectCard({ project, idx, status, getColor, getBgColor, fadeIn }) {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.3 });
  const [swipeProgress, setSwipeProgress] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const touchStartX = useRef(0);
  const containerWidth = useRef(0);
  const isMobile = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

  const handleTouchStart = useCallback((e) => {
    if (!isMobile) return;
    touchStartX.current = e.touches[0].clientX;
    containerWidth.current = e.currentTarget.offsetWidth;
    setIsSwiping(true);
  }, [isMobile]);

  const handleTouchMove = useCallback((e) => {
    if (!isSwiping || !isMobile) return;
    const diff = e.touches[0].clientX - touchStartX.current;
    const pct = Math.min(Math.max(diff / containerWidth.current, 0), 1);
    setSwipeProgress(pct);
  }, [isSwiping, isMobile]);

  const handleTouchEnd = useCallback(() => {
    if (!isMobile) return;
    // Snap to full if past 40%, otherwise reset
    if (swipeProgress > 0.4) {
      setSwipeProgress(1);
    } else {
      setSwipeProgress(0);
    }
    setIsSwiping(false);
  }, [swipeProgress, isMobile]);

  const barFillPercent = isMobile ? swipeProgress * status : 0;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: idx * 0.1 }}
      className="group"
    >
      <div
        className="relative mb-6 overflow-hidden bg-[#d6cec3] aspect-[4/3] touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img 
          src={project.image} 
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.1]"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-700 z-20" />
        <div className="absolute top-4 right-4 bg-white/95 p-4 min-w-[160px] shadow-sm backdrop-blur-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-bold tracking-widest uppercase text-gray-500">Progress</span>
            <span className={`text-xs font-bold ${getColor()}`}>{status}%</span>
          </div>
          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
            {/* Desktop: hover fill */}
            <div 
              className={`h-full ${getBgColor()} origin-left hidden md:block scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 ease-out`}
              style={{ width: `${status}%` }}
            />
            {/* Mobile: swipe fill */}
            <div 
              className={`h-full ${getBgColor()} origin-left md:hidden rounded-full`}
              style={{ 
                width: `${status}%`,
                transform: `scaleX(${swipeProgress})`,
                transition: isSwiping ? 'none' : 'transform 0.4s ease-out'
              }}
            />
          </div>
          {isMobile && swipeProgress === 0 && (
            <p className="text-[8px] text-gray-400 mt-1.5 text-center animate-pulse">
              Swipe right to reveal →
            </p>
          )}
        </div>
      </div>
      <h3 className="text-2xl md:text-3xl font-light text-gray-900 mb-2">{project.title}</h3>
      <p className="text-xs font-bold tracking-wider uppercase text-red-600 mb-4">{project.location}</p>
      <p className="text-[#5b5854] leading-relaxed">{project.description}</p>
    </motion.div>
  );
}