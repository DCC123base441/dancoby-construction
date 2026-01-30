import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      {/* Hero Section */}
      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: 'url(https://static.wixstatic.com/media/c1b522_74cf22378412427c8944f5e8a0fa3851~mv2.jpeg/v1/fill/w_1920,h_1080,fp_0.52_0.44,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/c1b522_074cf22378412427c8944f5e8a0fa3851~mv2.jpeg)'
          }}
        />
        <div className="absolute inset-0 bg-black/50" />

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.25, 0.4, 0.25, 1] }}
            className="space-y-8"
          >
            <div>
              <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
                Dancoby
              </h1>
              <p className="text-2xl md:text-3xl text-white/90 font-light mb-2">
                Construction Company
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="h-px w-12 bg-white/50" />
              <p className="text-lg tracking-wider text-white/80 uppercase font-light">
                Sophisticated — Customer Centric — Transformations
              </p>
              <div className="h-px w-12 bg-white/50" />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="flex flex-wrap gap-4 justify-center pt-8"
            >
              <Button asChild size="lg" className="bg-red-600 hover:bg-red-700 text-white px-10 py-6 text-lg rounded-none group">
                <Link to={createPageUrl('Contact')}>
                  Start Your Project
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-black px-10 py-6 text-lg rounded-none">
                <Link to={createPageUrl('Projects')}>View Projects</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}