import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

export default function TestimonialCard({ testimonial, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="border border-gray-200 rounded-lg p-8 bg-gray-50"
    >
      <Quote className="w-8 h-8 text-red-600 mb-4" />
      <p className="text-gray-700 text-lg leading-relaxed mb-6">
        "{testimonial.quote}"
      </p>
      <div>
        <p className="font-semibold text-gray-900">{testimonial.name}</p>
        <p className="text-sm text-gray-600">{testimonial.role}</p>
      </div>
    </motion.div>
  );
}