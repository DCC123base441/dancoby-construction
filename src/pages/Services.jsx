import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { ArrowRight } from 'lucide-react';
import SEOHead from '../components/SEOHead';

export default function Services() {
  const fadeIn = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  const services = [
    {
      title: "Interior Renovations",
      description: "Complete transformation of living spaces that blend form, function, and your unique aesthetic.",
      image: "https://static.wixstatic.com/media/c1b522_51ff5023986c46a88a21cb6a2bae4e3c~mv2.jpeg/v1/fill/w_334,h_457,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Dancoby_Penthouse%20Finished_Shot%2017.jpeg",
      page: "ServiceInteriorRenovations",
      highlights: ["Design consultation", "Custom cabinetry", "Premium finishes"]
    },
    {
      title: "Kitchen & Bath Remodeling",
      description: "Modern upgrades with premium materials and expert craftsmanship tailored to your lifestyle.",
      image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697c18d2dbda3b3101bfe937/c7315d418_Dancoby_ConklinBathroom_Shot2_V3_1.jpg",
      page: "ServiceKitchenBath",
      highlights: ["Custom cabinetry", "Premium fixtures", "Countertop options"]
    },
    {
      title: "Brownstone Restorations",
      description: "Preserving the charm of historic brownstones while enhancing modern comfort and functionality.",
      image: "https://static.wixstatic.com/media/c1b522_53439da5911740bcb80bd2033a393841~mv2.jpg/v1/fill/w_334,h_457,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/VAN_SARKI_STUDIO_8_PARK_SLOPE_2300.jpg",
      page: "ServiceBrownstone",
      highlights: ["Historic preservation", "Modern integration", "Custom details"]
    },
    {
      title: "Townhouses & Apartments",
      description: "Expert craftsmanship for high-end residential properties with sophisticated design and execution.",
      image: "https://static.wixstatic.com/media/c1b522_f3b8352ead454119b6fafb74781ff327~mv2.jpg/v1/fill/w_334,h_457,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/villier_living1_lightsoff.jpg",
      page: "ServiceTownhouses",
      highlights: ["High-end finishes", "Smart home systems", "Project management"]
    }
  ];

  return (
    <main className="min-h-screen bg-white">
      <SEOHead 
        title="Renovation Services | Kitchen, Bath, Brownstone Restoration"
        description="Full-service home renovation in NYC. Kitchen & bath remodeling, brownstone restorations, townhouse renovations, interior transformations. Licensed & insured contractors."
        keywords="kitchen remodeling Brooklyn, bathroom renovation NYC, brownstone restoration Brooklyn, townhouse renovation, interior design contractor, home improvement NYC"
      />
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1615873968403-89e068629265?q=80&w=1932&auto=format&fit=crop)'
          }}
        />
        <div className="absolute inset-0 bg-black/40" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center text-white max-w-3xl px-6"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">Our Services</h1>
          <p className="text-xl text-white/90">Specialized expertise across residential, commercial, and restoration projects</p>
        </motion.div>
      </section>

      {/* Services Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            {services.map((service, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group"
              >
                <Link to={createPageUrl(service.page)} className="block h-full">
                  <div className="relative overflow-hidden mb-8 bg-gray-200 aspect-[4/3]">
                    <img 
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-3xl font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                      {service.title}
                    </h2>
                    <p className="text-lg text-gray-700 leading-relaxed">
                      {service.description}
                    </p>
                    
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-xs uppercase tracking-widest text-gray-500 font-medium mb-3">Key Services</p>
                      <ul className="space-y-2">
                        {service.highlights.map((highlight, hidx) => (
                          <li key={hidx} className="flex items-center gap-2 text-sm text-gray-700">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button 
                      asChild
                      className="bg-gray-900 hover:bg-gray-800 text-white h-auto py-3 px-6 text-sm uppercase tracking-wider w-full justify-between group-hover:gap-3"
                    >
                      <div>
                        Learn More <ArrowRight className="w-4 h-4" />
                      </div>
                    </Button>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div {...fadeIn}>
            <h2 className="text-4xl md:text-5xl font-bold mb-8">Ready to Start Your Project?</h2>
            <p className="text-xl text-gray-300 mb-12">
              Contact us today to discuss your vision and explore how we can help bring it to life
            </p>
            <Button asChild size="lg" className="bg-red-600 hover:bg-red-700 text-white px-10">
              <Link to={createPageUrl('Contact')}>Get in Touch</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </main>
  );
}