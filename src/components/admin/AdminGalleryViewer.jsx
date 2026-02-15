import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';

export default function AdminGalleryViewer({ images, initialIndex = 0, projectTitle, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') { setCurrentIndex((i) => (i + 1) % images.length); setZoomed(false); }
      if (e.key === 'ArrowLeft') { setCurrentIndex((i) => (i - 1 + images.length) % images.length); setZoomed(false); }
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKey);
    };
  }, [images.length, onClose]);

  const goTo = (idx) => { setCurrentIndex(idx); setZoomed(false); };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/95 flex flex-col"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 flex-shrink-0">
        <div>
          <h3 className="text-white font-semibold text-lg">{projectTitle}</h3>
          <p className="text-white/50 text-sm">{currentIndex + 1} of {images.length} images</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoomed(!zoomed)}
            className="text-white/60 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            {zoomed ? <ZoomOut className="w-5 h-5" /> : <ZoomIn className="w-5 h-5" />}
          </button>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main image area */}
      <div className="flex-1 relative flex items-center justify-center min-h-0 px-16">
        {images.length > 1 && (
          <>
            <button
              onClick={() => goTo((currentIndex - 1 + images.length) % images.length)}
              className="absolute left-4 z-10 text-white/50 hover:text-white p-3 bg-white/5 hover:bg-white/10 rounded-full transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => goTo((currentIndex + 1) % images.length)}
              className="absolute right-4 z-10 text-white/50 hover:text-white p-3 bg-white/5 hover:bg-white/10 rounded-full transition-all"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full flex items-center justify-center"
          >
            <img
              src={images[currentIndex]}
              alt={`${projectTitle} - Image ${currentIndex + 1}`}
              className={`max-h-full object-contain transition-all duration-300 rounded-lg ${
                zoomed ? 'max-w-none w-auto cursor-zoom-out scale-150' : 'max-w-full cursor-zoom-in'
              }`}
              onClick={() => setZoomed(!zoomed)}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="flex-shrink-0 px-6 py-4">
          <div className="flex gap-2 justify-center overflow-x-auto pb-1">
            {images.map((url, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  i === currentIndex
                    ? 'border-white ring-1 ring-white/30 scale-105'
                    : 'border-transparent opacity-50 hover:opacity-80'
                }`}
              >
                <img src={url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}