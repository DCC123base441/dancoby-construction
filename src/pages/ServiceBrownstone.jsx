import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { CheckCircle2 } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import FeaturedProjectsShowcase from '../components/FeaturedProjectsShowcase';

export default function ServiceBrownstone() {
  const fadeIn = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen bg-white">
      <SEOHead 
        title="Brownstone Restorations | Dancoby Construction"
        description="Expert brownstone restoration in Brooklyn & Park Slope. Historic facade preservation, original hardwood refinishing, modern integration. Licensed general contractor."
        keywords="brownstone restoration Brooklyn, brownstone renovation Park Slope, historic home restoration, brownstone contractor Brooklyn, facade preservation, brownstone remodel Long Island, general contractor brownstone, Park Slope brownstone renovation, brownstone restoration near me"
      />
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://static.wixstatic.com/media/c1b522_0463b4b57a704427b7c60a57afd204b4~mv2.jpg/v1/fill/w_445,h_520,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/VAN_SARKI_STUDIO_8_PARK_SLOPE_2269%201.jpg)'
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
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">Brownstone Restorations</h1>
          <p className="text-xl text-white/90">Preserving the charm of historic brownstones while enhancing modern comfort and functionality</p>
        </motion.div>
      </section>

      {/* Service Overview */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div {...fadeIn} className="mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">About This Service</h2>
            <p className="text-lg text-gray-700 leading-relaxed max-w-3xl">
              Historic brownstones require specialized expertise to restore. We understand the architectural significance of these properties and combine authentic restoration techniques with modern systems and amenities. Our team respects the original character while creating comfortable, contemporary living spaces.
            </p>
          </motion.div>

          <motion.div {...fadeIn} className="grid md:grid-cols-2 gap-12">
            <div>
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697c18d2dbda3b3101bfe937/f2d5f67ad_VAN_SARKI_STUDIO_8_PARK_SLOPE_23491.jpg"
                alt="Brownstone Restoration"
                className="w-full h-auto rounded-lg"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-gray-900">Our Specialization</h3>
              <ul className="space-y-4">
                {[
                  'Historic facade preservation and restoration',
                  'Original hardwood floor refinishing',
                  'Period-appropriate architectural details',
                  'Cast iron and plasterwork restoration',
                  'Modern electrical and plumbing integration',
                  'Custom millwork matching original design',
                  'Multi-family unit conversions',
                  'Building code compliance updates'
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
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2 {...fadeIn} className="text-4xl font-bold text-gray-900 mb-16 text-center">
            Our Restoration Process
          </motion.h2>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Historic Assessment',
                description: 'We evaluate the building\'s original architecture, structural integrity, and preservation needs.'
              },
              {
                step: '02',
                title: 'Restoration Planning',
                description: 'Develop detailed plans that balance historic preservation with modern living requirements.'
              },
              {
                step: '03',
                title: 'Expert Restoration',
                description: 'Execute restoration using period-appropriate techniques and high-quality materials.'
              },
              {
                step: '04',
                title: 'Modern Integration',
                description: 'Seamlessly integrate modern systems while maintaining historic character and charm.'
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
      <FeaturedProjectsShowcase title="Featured Brownstone Restorations" />

      {/* CTA Section */}
      <section className="py-32 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div {...fadeIn}>
            <h2 className="text-4xl md:text-5xl font-bold mb-8">Restore Your Brownstone to Its Glory</h2>
            <p className="text-xl text-gray-300 mb-12">
              Our experts understand historic properties. Let's preserve and enhance your brownstone
            </p>
            <Button asChild size="lg" className="bg-red-600 hover:bg-red-700 text-white px-10">
              <Link to={createPageUrl('Contact')}>Schedule a Consultation</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}