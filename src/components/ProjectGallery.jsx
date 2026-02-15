import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import OptimizedImage from "@/components/OptimizedImage";

export default function ProjectGallery({ images }) {
  const [selectedIndex, setSelectedIndex] = useState(null);

  if (!images || images.length === 0) return null;

  const handlePrevious = useCallback((e) => {
    e?.stopPropagation();
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const handleNext = useCallback((e) => {
    e?.stopPropagation();
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  useEffect(() => {
    if (selectedIndex === null) return;
    document.body.style.overflow = 'hidden';
    const handleKey = (e) => {
      if (e.key === 'ArrowLeft') handlePrevious(e);
      if (e.key === 'ArrowRight') handleNext(e);
      if (e.key === 'Escape') setSelectedIndex(null);
    };
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKey);
    };
  }, [selectedIndex, handlePrevious, handleNext]);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-stone-200" />
        <h2 className="text-[13px] uppercase tracking-[0.25em] text-stone-500 font-medium">Gallery</h2>
        <div className="h-px flex-1 bg-stone-200" />
      </div>

      {/* Uniform grid — same size, no distortion */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {images.map((image, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.05 }}
            className="group relative aspect-square cursor-pointer overflow-hidden bg-stone-100"
            onClick={() => setSelectedIndex(idx)}
          >
            <img
              src={image}
              alt={`Gallery image ${idx + 1}`}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
            onClick={() => setSelectedIndex(null)}
          >
            {/* Close */}
            <button
              className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
              onClick={() => setSelectedIndex(null)}
            >
              <X className="w-5 h-5" />
            </button>

            {/* Counter */}
            <div className="absolute top-6 left-6 text-white/50 text-sm font-light tracking-wider">
              {selectedIndex + 1} / {images.length}
            </div>

            {/* Nav */}
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-white/50 hover:text-white transition-colors hidden md:flex"
              onClick={handlePrevious}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-white/50 hover:text-white transition-colors hidden md:flex"
              onClick={handleNext}
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Image — object-contain to never stretch */}
            <div
              className="relative max-h-full max-w-full p-4 md:px-20"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.img
                key={selectedIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                src={images[selectedIndex]}
                alt="Gallery preview"
                draggable={false}
                className="max-h-[85vh] max-w-full object-contain select-none mx-auto"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}