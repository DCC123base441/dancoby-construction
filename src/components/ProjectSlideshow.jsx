import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProjectSlideshow({ images }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!images || images.length === 0) return null;

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % images.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="relative">
      {/* Slideshow */}
      <div className="relative overflow-hidden bg-gray-100">
        {images.map((image, idx) => (
          <motion.div
            key={idx}
            initial={false}
            animate={{
              opacity: currentSlide === idx ? 1 : 0,
            }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
            style={{ pointerEvents: currentSlide === idx ? 'auto' : 'none' }}
          >
            <img 
              src={image}
              alt={`Slide ${idx + 1}`}
              className="w-full h-auto object-contain"
            />
          </motion.div>
        ))}
      </div>

      {/* Navigation */}
      {images.length > 1 && (
        <>
          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center transition-all"
          >
            <ChevronLeft className="w-5 h-5 text-gray-900" />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center transition-all"
          >
            <ChevronRight className="w-5 h-5 text-gray-900" />
          </button>

          {/* Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentSlide === idx ? 'bg-white w-6' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}