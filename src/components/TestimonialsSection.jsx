import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const fallbackTestimonials = [
  { id: 1, client_name: 'Sarah M.', role: 'Brooklyn Heights', quote: 'Dancoby transformed our dated brownstone into the home we always dreamed of. Their attention to detail is unmatched.' },
  { id: 2, client_name: 'Michael & Lisa R.', role: 'Park Slope', quote: 'From start to finish, the team was professional, communicative, and delivered beyond our expectations.' },
  { id: 3, client_name: 'Pam A', role: 'Manhattan', quote: 'Working with Ralph and his team was an absolute pleasure. They respected our vision while bringing expertise we didn\'t know we needed.' },
];

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const { data: testimonials = [] } = useQuery({
    queryKey: ['testimonials'],
    queryFn: () => base44.entities.Testimonial.list('order', 10),
    initialData: [],
  });

  const displayTestimonials = testimonials.length > 0 ? testimonials : fallbackTestimonials;

  useEffect(() => {
    if (displayTestimonials.length === 0 || isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayTestimonials.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [displayTestimonials.length, isPaused]);

  const goTo = (index) => setCurrentIndex(index);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + displayTestimonials.length) % displayTestimonials.length);
  const next = () => setCurrentIndex((prev) => (prev + 1) % displayTestimonials.length);

  const testimonial = displayTestimonials[currentIndex];

  return (
    <section className="py-24 lg:py-32 bg-[#f5f3f0]">
      <div className="max-w-5xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.3em] uppercase text-[#8b7355] mb-4">Testimonials</p>
          <h2 className="text-4xl lg:text-5xl font-light text-[#2d2d2d]">What Clients Say</h2>
        </div>

        <div 
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              {/* Stars */}
              <div className="flex justify-center gap-1 mb-8">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[#8b7355] text-[#8b7355]" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-2xl lg:text-3xl font-light text-[#2d2d2d] leading-relaxed mb-8 max-w-3xl mx-auto">
                "{testimonial?.quote}"
              </blockquote>

              {/* Attribution */}
              <div>
                <p className="text-lg font-light text-[#2d2d2d]">{testimonial?.client_name}</p>
                {testimonial?.role && (
                  <p className="text-sm text-[#8b7355] mt-1">{testimonial.role}</p>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-6 mt-12">
            <button 
              onClick={prev}
              className="w-12 h-12 border border-[#2d2d2d]/20 flex items-center justify-center hover:bg-[#2d2d2d] hover:text-white transition-all duration-300"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="flex gap-2">
              {displayTestimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === currentIndex ? 'bg-[#8b7355] w-6' : 'bg-[#2d2d2d]/20 hover:bg-[#2d2d2d]/40'
                  }`}
                />
              ))}
            </div>

            <button 
              onClick={next}
              className="w-12 h-12 border border-[#2d2d2d]/20 flex items-center justify-center hover:bg-[#2d2d2d] hover:text-white transition-all duration-300"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Google Review Link */}
          <div className="text-center mt-8">
            <a 
              href="https://www.google.com/search?q=dancoby+construction+reviews" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-[#8b7355] hover:text-[#2d2d2d] transition-colors underline underline-offset-4"
            >
              Leave a Review on Google
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}