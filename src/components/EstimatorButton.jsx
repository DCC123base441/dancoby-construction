import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function EstimatorButton({ className = '', size = 'default' }) {
  const sizeClasses = {
    small: 'px-4 py-2 text-xs',
    default: 'px-6 py-3 text-sm',
    large: 'px-8 py-4 text-base'
  };

  return (
    <Link to={createPageUrl('Estimator')} className={className}>
      <motion.div
        className={`relative inline-flex items-center gap-2 font-semibold uppercase tracking-wider rounded-lg overflow-hidden ${sizeClasses[size]}`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Animated gradient background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-red-600 via-orange-500 to-red-600"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{ backgroundSize: '200% 200%' }}
        />
        
        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
            repeatDelay: 1,
          }}
        />
        
        {/* Content */}
        <span className="relative z-10 text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          Online Estimate
        </span>
      </motion.div>
    </Link>
  );
}