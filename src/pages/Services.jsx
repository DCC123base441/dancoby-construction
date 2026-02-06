import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import SEOHead from '../components/SEOHead';

export default function Services() {
  const services = [
    {
      title: 'Kitchen & Bath',
      description: 'Transform the heart of your home with custom cabinetry, premium countertops, and thoughtful layouts that combine beauty with functionality.',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
      path: 'ServiceKitchenBath',
      features: ['Custom Cabinetry', 'Premium Countertops', 'Modern Fixtures', 'Lighting Design']
    },
    {
      title: 'Brownstone Restoration',
      description: 'Preserve the historic character of your Brooklyn brownstone while modernizing for contemporary living. Expert craftsmanship honoring original details.',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
      path: 'ServiceBrownstone',
      features: ['Historic Preservation', 'Facade Restoration', 'Period Details', 'Modern Systems']
    },
    {
      title: 'Interior Renovations',
      description: 'Complete interior transformations that reimagine your living spaces. From open floor plans to custom millwork, we bring your vision to life.',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
      path: 'ServiceInteriorRenovations',
      features: ['Open Floor Plans', 'Custom Millwork', 'Built-in Storage', 'Finish Selection']
    },
    {
      title: 'Townhouses',
      description: 'Multi-floor renovations that maximize space and flow. Expert handling of structural modifications and seamless integration of modern amenities.',
      image: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800&q=80',
      path: 'ServiceTownhouses',
      features: ['Multi-floor Projects', 'Structural Work', 'Space Planning', 'Premium Finishes']
    },
  ];

  return (
    <main className="bg-[#faf9f7]">
      <SEOHead 
        title="Our Services | NYC Home Renovation Services"
        description="Explore Dancoby Construction's renovation services: kitchen & bath remodeling, brownstone restoration, interior renovations, and townhouse projects."
      />

      {/* Hero */}
      <section className="pt-32 pb-16 lg:pt-40 lg:pb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="max-w-3xl">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs tracking-[0.3em] uppercase text-[#8b7355] mb-6"
            >
              What We Do
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl lg:text-6xl font-light leading-[1.1] text-[#2d2d2d] mb-8"
            >
              Our<br /><span className="italic">Services</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-[#2d2d2d]/70 leading-relaxed"
            >
              From intimate bathroom refreshes to complete home transformations, 
              we bring the same level of care, craftsmanship, and attention to every project.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="pb-24 lg:pb-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="space-y-24">
            {services.map((service, i) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`grid lg:grid-cols-2 gap-12 lg:gap-24 items-center ${
                  i % 2 === 1 ? 'lg:grid-flow-dense' : ''
                }`}
              >
                <div className={i % 2 === 1 ? 'lg:col-start-2' : ''}>
                  <Link to={createPageUrl(service.path)} className="block group">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img 
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                  </Link>
                </div>
                <div className={i % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}>
                  <p className="text-xs tracking-[0.3em] uppercase text-[#8b7355] mb-4">0{i + 1}</p>
                  <h2 className="text-3xl lg:text-4xl font-light text-[#2d2d2d] mb-6">{service.title}</h2>
                  <p className="text-[#2d2d2d]/70 leading-relaxed mb-8">{service.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    {service.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 bg-[#8b7355] rounded-full" />
                        <span className="text-sm text-[#2d2d2d]/70">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Link
                    to={createPageUrl(service.path)}
                    className="inline-flex items-center gap-2 text-sm tracking-[0.15em] uppercase text-[#2d2d2d] hover:text-[#8b7355] transition-colors"
                  >
                    Learn More <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 lg:py-32 bg-[#2d2d2d] text-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-[#c4bdb4] mb-6">Ready to Begin?</p>
          <h2 className="text-4xl lg:text-5xl font-light mb-8">
            Let's Discuss<br /><span className="italic">Your Vision</span>
          </h2>
          <Link
            to={createPageUrl('Contact')}
            className="inline-flex items-center gap-3 px-10 py-5 bg-white text-[#2d2d2d] text-sm tracking-[0.15em] uppercase hover:bg-[#f5f3f0] transition-colors duration-300"
          >
            Get in Touch
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}