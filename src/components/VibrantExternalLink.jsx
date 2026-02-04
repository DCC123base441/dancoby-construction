import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

export default function VibrantExternalLink({ href, children, className = '', size = 'default' }) {
  const sizeClasses = {
    small: 'px-4 py-2 text-xs',
    default: 'px-8 py-6 text-sm', // Matching the dimensions of the other buttons in Home.js (px-8 py-6)
    large: 'px-10 py-6 text-base'
  };

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`inline-block ${className}`}>
      <motion.div
        className={`relative inline-flex items-center justify-center w-full gap-2 font-semibold tracking-wider rounded-md overflow-hidden ${sizeClasses[size]}`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Animated gradient background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-600"
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
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent"
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
        <span className="relative z-10 text-white flex items-center gap-2 uppercase">
          {children}
          <ExternalLink className="w-4 h-4" />
        </span>
      </motion.div>
    </a>
  );
}