import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function VibrantExternalLink({ href, children, className = '' }) {
  // Using Button component to match exact dimensions and behavior of adjacent buttons
  return (
    <Button
      asChild
      className={cn(
        // Base styles to match adjacent buttons (px-8 py-6 text-sm tracking-wider uppercase)
        "relative overflow-hidden border-0 px-8 py-6 text-sm font-medium tracking-wider uppercase text-white shadow-md transition-all duration-200",
        className
      )}
    >
      <a href={href} target="_blank" rel="noopener noreferrer">
        {/* Animated gradient background - Absolute positioned to cover button bg */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-600 z-0"
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
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent z-0"
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
        <span className="relative z-10 flex items-center gap-2">
          {children}
          <ExternalLink className="w-4 h-4" />
        </span>
      </a>
    </Button>
  );
}