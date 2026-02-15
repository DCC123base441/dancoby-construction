import React from 'react';
import { motion } from 'framer-motion';

export default function ProjectStats({ budget, timeline, materials }) {
  const stats = [
    { label: 'Budget', value: budget },
    { label: 'Timeline', value: timeline },
  ].filter(s => s.value);

  return (
    <div className="space-y-16">
      {/* Stats */}
      {stats.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-16">
          {stats.map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <p className="text-[11px] uppercase tracking-[0.3em] text-stone-400 font-medium mb-2">
                {stat.label}
              </p>
              <p className="text-2xl md:text-3xl font-extralight text-stone-900 tracking-tight">
                {stat.value}
              </p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Materials */}
      {materials && materials.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-[11px] uppercase tracking-[0.3em] text-stone-400 font-medium mb-6">
            Materials & Finishes
          </p>
          <div className="flex flex-wrap gap-2">
            {materials.map((material, idx) => (
              <span 
                key={idx} 
                className="px-4 py-2 bg-stone-50 border border-stone-100 text-stone-600 text-sm font-light tracking-wide"
              >
                {material}
              </span>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}