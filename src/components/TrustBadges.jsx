import React from 'react';
import { Shield, Award, CheckCircle2, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TrustBadges({ variant = 'default', className = '' }) {
  const badges = [
    { icon: Shield, label: 'Licensed & Insured', sublabel: 'Full protection' },
    { icon: Award, label: '20+ Years', sublabel: 'Experience' },
    { icon: CheckCircle2, label: '5.0 Rating', sublabel: '50+ Reviews' },
    { icon: Clock, label: '3-Year Warranty', sublabel: 'Guaranteed' },
  ];

  if (variant === 'compact') {
    return (
      <div className={`flex flex-wrap items-center justify-center gap-4 ${className}`}>
        {badges.map((badge, idx) => (
          <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
            <badge.icon className="w-4 h-4 text-red-600" />
            <span className="font-medium">{badge.label}</span>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'minimal') {
    return (
      <div className={`flex items-center justify-center gap-6 ${className}`}>
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-green-600" />
          <span className="text-xs text-gray-500">Licensed & Insured</span>
        </div>
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-green-600" />
          <span className="text-xs text-gray-500">3-Year Warranty</span>
        </div>
      </div>
    );
  }

  return (
    <section className={`py-8 bg-gray-50 border-y border-gray-100 ${className}`}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {badges.map((badge, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-center gap-3 justify-center"
            >
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100">
                <badge.icon className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-900 text-sm">{badge.label}</div>
                <div className="text-xs text-gray-500">{badge.sublabel}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}