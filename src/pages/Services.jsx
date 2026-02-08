import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { ArrowRight } from 'lucide-react';
import SEOHead from '../components/SEOHead';

export default function Services() {
  const heroRef = useRef(null);
  const ctaRef = useRef(null);

  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const { scrollYProgress: ctaScrollProgress } = useScroll({
    target: ctaRef,
    offset: ["start end", "end start"]
  });

  const heroY = useTransform(heroScrollProgress, [0, 1], ["0%", "30%"]);
  const heroScale = useTransform(heroScrollProgress, [0, 1], [1, 1.1]);
  const ctaY = useTransform(ctaScrollProgress, [0, 1], ["0%", "15%"]);

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
      <section ref={heroRef} className="relative h-[75vh] flex items-center overflow-hidden">
        <motion.div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697c18d2dbda3b3101bfe937/a1e1431e0_generated_image.png)',
            y: heroY,
            scale: heroScale
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <motion.div 
                className="h-px w-16 bg-gradient-to-r from-red-500 to-red-600 mb-6"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                style={{ transformOrigin: 'left' }}
              />
              <motion.p 
                className="text-white/70 text-[10px] md:text-xs uppercase tracking-[0.3em] mb-4 font-light"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                Our Services
              </motion.p>
              <motion.h1 
                className="text-3xl md:text-5xl lg:text-6xl font-extralight tracking-wide text-white leading-[1.15] mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                Full-Service<br /><em className="italic font-light text-white/90">Rejuvenation</em>
              </motion.h1>
              <motion.p 
                className="text-white/60 text-base md:text-lg leading-relaxed max-w-xl font-light"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
              >
                Specialized expertise in residential construction, interiors, and custom projects.
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12 md:py-24 bg-white">
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
                      className="w-full h-full object-cover group-hover:scale-[1.1] transition-transform duration-700"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-700 z-20" />
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
      <section ref={ctaRef} className="py-16 md:py-32 bg-gray-900 text-white relative overflow-hidden">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-t from-gray-800 to-gray-900"
          style={{ y: ctaY }}
        />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
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