import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { CheckCircle2 } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import FeaturedProjectsShowcase from '../components/FeaturedProjectsShowcase';

export default function ServiceInteriorRenovations() {
  const fadeIn = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen bg-white">
      <SEOHead 
        title="Interior Renovations | Dancoby Construction"
        description="Complete interior renovation services in Brooklyn & Long Island. Custom millwork, flooring, lighting design. Licensed general contractor serving Park Slope & Nassau County."
        keywords="interior renovation Brooklyn, home renovation Long Island, interior remodel Park Slope, full home renovation Five Towns, general contractor interior renovation, living room renovation Brooklyn, custom millwork Long Island, residential renovation Nassau County, interior contractor near me"
      />
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://static.wixstatic.com/media/c1b522_38c04d6b49cb48ab8c1755d93f712bb4~mv2.jpeg/v1/fill/w_1920,h_1080,fp_0.52_0.44,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/c1b522_38c04d6b49cb48ab8c1755d93f712bb4~mv2.jpeg)'
          }}
        />
        <div className="absolute inset-0 bg-black/40" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center text-white max-w-3xl px-6"
        >
          <div className="h-1 w-16 bg-red-600 mx-auto mb-6" />
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">Interior Renovations</h1>
          <p className="text-xl text-white/90">Complete transformation of living spaces that blend form, function, and your unique aesthetic</p>
        </motion.div>
      </section>

      {/* Service Overview */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div {...fadeIn} className="mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">About This Service</h2>
            <p className="text-lg text-gray-700 leading-relaxed max-w-3xl">
              Our interior renovation services transform your living space into a reflection of your lifestyle and taste. Whether you're looking to modernize an outdated home, improve functionality, or create a sophisticated new aesthetic, our team of expert professionals works collaboratively with you from concept to completion.
            </p>
          </motion.div>

          <motion.div {...fadeIn} className="grid md:grid-cols-2 gap-12">
            <div>
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697c18d2dbda3b3101bfe937/99a553c33_Dancoby_PenthouseFinished_Shot9.jpg"
                alt="Interior Renovation"
                className="w-full h-auto rounded-lg"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-gray-900">What We Include</h3>
              <ul className="space-y-4">
                {[
                  'Comprehensive design consultation and planning',
                  'Structural modifications and layout optimization',
                  'Custom cabinetry and millwork',
                  'Premium flooring and surface finishes',
                  'Electrical and plumbing upgrades',
                  'Lighting design and installation',
                  'Interior styling and finishing touches'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2 {...fadeIn} className="text-4xl font-bold text-gray-900 mb-16 text-center">
            Our Process
          </motion.h2>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Consultation',
                description: 'We meet with you to understand your vision, goals, budget, and timeline for the project.'
              },
              {
                step: '02',
                title: 'Design & Planning',
                description: 'Our design team creates detailed plans and 3D visualizations of your new space.'
              },
              {
                step: '03',
                title: 'Construction',
                description: 'Our skilled contractors execute the work with meticulous attention to detail and quality.'
              },
              {
                step: '04',
                title: 'Completion',
                description: 'Final inspections, finishing touches, and walkthrough to ensure your complete satisfaction.'
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-lg p-8 border border-gray-200"
              >
                <div className="text-4xl font-bold text-red-600 mb-4">{item.step}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <FeaturedProjectsShowcase title="Featured Interior Renovations" />

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div {...fadeIn}>
            <h2 className="text-4xl md:text-5xl font-bold mb-8">Ready to Transform Your Space?</h2>
            <p className="text-xl text-gray-300 mb-12">
              Let's discuss your interior renovation project and create your dream home
            </p>
            <Button asChild size="lg" className="bg-red-600 hover:bg-red-700 text-white px-10">
              <Link to={createPageUrl('Contact')}>Schedule Your Consultation</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}