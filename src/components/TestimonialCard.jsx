import React from 'react';
import { motion } from 'framer-motion';

export default function TestimonialCard({ testimonial, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="border border-stone-100 p-8 md:p-10 bg-stone-50/50 relative"
    >
      <span className="text-5xl font-serif text-red-400/30 absolute top-4 left-6 leading-none">"</span>
      <p className="text-stone-600 text-base leading-relaxed mb-6 font-light mt-4 relative z-10">
        {testimonial.quote}
      </p>
      <div className="flex items-center gap-3">
        <div className="w-8 h-px bg-red-400" />
        <div>
          <p className="font-medium text-stone-900 text-sm">{testimonial.name}</p>
          {testimonial.role && (
            <p className="text-xs text-stone-400 tracking-wide">{testimonial.role}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}