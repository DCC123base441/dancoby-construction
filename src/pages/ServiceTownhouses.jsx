import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { CheckCircle2 } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import FeaturedProjectsShowcase from '../components/FeaturedProjectsShowcase';

export default function ServiceTownhouses() {
  const fadeIn = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen bg-white">
      <SEOHead 
        title="Townhouse & Apartment Renovations | Dancoby Construction"
        description="High-end townhouse and apartment renovation in Brooklyn & Long Island. Smart home integration, premium finishes, expert project management. Licensed general contractor."
        keywords="townhouse renovation Brooklyn, apartment renovation Long Island, luxury apartment remodel Park Slope, townhouse contractor Five Towns, high-end residential renovation, condo renovation Nassau County, general contractor townhouse, apartment renovation near me"
      />
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://static.wixstatic.com/media/c1b522_f3b8352ead454119b6fafb74781ff327~mv2.jpg/v1/fill/w_334,h_457,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/villier_living1_lightsoff.jpg)'
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
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">Townhouses & Apartments</h1>
          <p className="text-xl text-white/90">Expert craftsmanship for high-end residential properties with sophisticated design</p>
        </motion.div>
      </section>

      {/* Service Overview */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div {...fadeIn} className="mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">About This Service</h2>
            <p className="text-lg text-gray-700 leading-relaxed max-w-3xl">
              From luxury apartments to sophisticated townhouses, we specialize in high-end residential properties that demand premium finishes and expert project management. Whether it's a full renovation or selective upgrades, we deliver results that exceed expectations.
            </p>
          </motion.div>

          <motion.div {...fadeIn} className="grid md:grid-cols-2 gap-12">
            <div>
              <img 
                src="https://static.wixstatic.com/media/c1b522_ad38c506d35e4fd6a819d8702ad6b680~mv2.jpg/v1/fill/w_445,h_520,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Dancoby_849%20Central_15.jpg"
                alt="Townhouse & Apartment"
                className="w-full h-auto rounded-lg"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-gray-900">What We Deliver</h3>
              <ul className="space-y-4">
                {[
                  'Full property renovations and upgrades',
                  'High-end finishing and premium materials',
                  'Custom millwork and architectural details',
                  'Smart home system integration',
                  'Efficient project scheduling and management',
                  'Multi-unit coordination and timelines',
                  'Design consultation and styling',
                  'Specialized handling of occupied properties'
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
            Our Project Process
          </motion.h2>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Property Assessment',
                description: 'Thorough evaluation of your property to understand scope and customize the approach.'
              },
              {
                step: '02',
                title: 'Design Development',
                description: 'Create a comprehensive design plan with 3D visualizations and detailed specifications.'
              },
              {
                step: '03',
                title: 'Coordinated Execution',
                description: 'Professional project management ensuring minimal disruption and timely completion.'
              },
              {
                step: '04',
                title: 'Premium Finish',
                description: 'Meticulous attention to every detail, final inspections, and thorough walkthrough.'
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
      <FeaturedProjectsShowcase title="Featured Townhouse & Apartment Projects" />

      {/* CTA Section */}
      <section className="py-32 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div {...fadeIn}>
            <h2 className="text-4xl md:text-5xl font-bold mb-8">Transform Your Property with Premium Craftsmanship</h2>
            <p className="text-xl text-gray-300 mb-12">
              Let's create a sophisticated space that reflects your lifestyle and exceeds your expectations
            </p>
            <Button asChild size="lg" className="bg-red-600 hover:bg-red-700 text-white px-10">
              <Link to={createPageUrl('Contact')}>Get Your Free Estimate</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}