import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, ExternalLink } from 'lucide-react';

const testimonials = [
  {
    name: "Amanda O",
    title: "Homeowner, Brooklyn, NY",
    review: "Dancoby Construction did an absolutely incredible job renovating our entire home and they finished ON TIME! The owner, Ralph Abekassis, is open, transparent, fair and respectful. He was very communicative with regular onsite meetings, very clear around any changes or issues and while we were away he sent us daily updates with pictures on progress",
    initial: "A"
  },
  {
    name: "Emma J",
    title: "Homeowner, Brooklyn, NY",
    review: "This is the second time we have used Ralph and his team… They do an excellent job. Ralph and his team are very professional, superb communicators, and always made sure we had a very pleasant experience throughout our renovation. Their work is beautiful and we could not recommend enough!",
    initial: "E"
  },
  {
    name: "Nelli C",
    title: "Homeowner, Brooklyn, NY",
    review: "OH MY GOD! Those are the three words you will say once you complete a home renovation with Ralph and his team. Ralph is a truly dependable professional, who is extremely knowledgeable and someone you can count on to get the job DONE.",
    initial: "N"
  },
  {
    name: "Kyle M",
    title: "Homeowner, Brooklyn, NY",
    review: "Ralph is everything you want in a contractor: prompt, polite, organized, detail-oriented, knowledgeable, and a clear communicator. We worked with his team to renovate our home under a tight timeline and they delivered an outstanding result. NYC-area contractors are a bit of a mixed bag but I would highly recommend Dancoby to anyone.",
    initial: "K"
  }
];

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  const testimonial = testimonials[currentIndex];

  return (
    <section className="py-16 bg-stone-100">
      <div className="max-w-6xl mx-auto px-6">
        {/* Google Reviews Banner */}
        <div className="bg-stone-800 rounded-xl p-6 md:p-8 mb-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-stone-400 mb-3">Customer Reviews</p>
              <p className="text-stone-300 text-sm md:text-base max-w-xl">
                Don't just take our word for it. See what our customers have to say about their experience with Dancoby Construction.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">

              <a 
                href="https://g.page/r/CfLkGeakL9MkEAI/review"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-stone-800 px-5 py-3 rounded-lg text-sm font-medium hover:bg-stone-100 transition-colors"
              >
                Review Us
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[200px_1fr] gap-10 items-start">
          {/* Desktop Navigation */}
          <div className="hidden lg:block sticky top-20">
            <p className="text-xs uppercase tracking-[0.3em] text-stone-400 mb-5">Testimonials</p>
            <div className="flex flex-col gap-2">
              {testimonials.map((t, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-full text-left px-3 py-2 border-l-2 transition-all text-sm ${
                    index === currentIndex 
                      ? 'border-stone-800 bg-white text-stone-900 font-medium' 
                      : 'border-transparent text-stone-500 hover:border-stone-300'
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="bg-white p-8 rounded-xl shadow-sm">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-16 h-16 rounded-full bg-stone-800 flex items-center justify-center">
                  <span className="text-2xl font-light text-white">{testimonial.initial}</span>
                </div>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-stone-900 text-stone-900" />
                  ))}
                </div>
              </div>
              
              <p className="text-xl md:text-2xl font-light leading-relaxed text-stone-800 mb-8">
                "{testimonial.review}"
              </p>
              
              <div className="mb-6">
                <p className="text-lg text-stone-900 font-medium">{testimonial.name}</p>
                <p className="text-sm text-stone-500">{testimonial.title}</p>
              </div>

              {/* Mobile Navigation */}
              <div className="flex items-center gap-4 border-t border-stone-200 pt-6 lg:hidden">
                <button 
                  onClick={prevSlide}
                  className="p-2 rounded-full hover:bg-stone-100 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-stone-600" />
                </button>
                <span className="text-sm text-stone-500">
                  {currentIndex + 1} / {testimonials.length}
                </span>
                <button 
                  onClick={nextSlide}
                  className="p-2 rounded-full hover:bg-stone-100 transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-stone-600" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}