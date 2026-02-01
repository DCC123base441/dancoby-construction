import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProjectSlideshow({ images }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!images || images.length === 0) return null;

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % images.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="space-y-4">
      {/* Main Slideshow */}
      <div className="relative overflow-hidden bg-neutral-900 rounded-xl aspect-[4/3] md:aspect-video group select-none">
        <img
          src={images[currentSlide]}
          alt={`Project image ${currentSlide + 1}`}
          className="absolute inset-0 w-full h-full object-contain"
          loading="eager"
          decoding="async"
        />

        {/* Navigation */}
        {images.length > 1 && (
          <>
            <button 
              onClick={(e) => { e.stopPropagation(); prevSlide(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-lg hover:scale-105 active:scale-95"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5 text-gray-900" />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); nextSlide(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-lg hover:scale-105 active:scale-95"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5 text-gray-900" />
            </button>
          </>
        )}
        
        {/* Counter */}
        <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full font-medium">
          {currentSlide + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {images.map((image, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden transition-all duration-200 ${
                currentSlide === idx ? 'ring-2 ring-red-600 ring-offset-2 opacity-100' : 'opacity-60 hover:opacity-100'
              }`}
            >
              <img 
                src={image}
                alt={`Thumbnail ${idx + 1}`}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}