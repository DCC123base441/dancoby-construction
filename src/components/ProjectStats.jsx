import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Calendar, Hammer } from 'lucide-react';

export default function ProjectStats({ budget, timeline, materials }) {
  const stats = [
    { icon: DollarSign, label: 'Budget', value: budget },
    { icon: Calendar, label: 'Timeline', value: timeline },
  ];

  return (
    <div className="space-y-12">
      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="grid md:grid-cols-2 gap-8"
      >
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="border-b border-gray-200 pb-6">
              <div className="flex items-center gap-3 mb-2">
                <Icon className="w-5 h-5 text-gray-600" />
                <p className="text-xs uppercase tracking-widest text-gray-500 font-medium">
                  {stat.label}
                </p>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </motion.div>

      {/* Materials */}
      {materials && materials.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Hammer className="w-5 h-5 text-gray-600" />
            <h3 className="text-xs uppercase tracking-widest text-gray-500 font-medium">
              Materials & Finishes
            </h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {materials.map((material, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-red-600 mt-2 flex-shrink-0" />
                <span className="text-gray-700">{material}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}