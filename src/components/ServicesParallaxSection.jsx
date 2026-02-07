import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';

const services = [
  {
    title: "Interior Renovations",
    description: "Complete transformation of living spaces for form and function.",
    image: "https://static.wixstatic.com/media/c1b522_51ff5023986c46a88a21cb6a2bae4e3c~mv2.jpeg/v1/fill/w_334,h_457,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Dancoby_Penthouse%20Finished_Shot%2017.jpeg",
    page: "ServiceInteriorRenovations"
  },
  {
    title: "Kitchen & Bath Remodeling",
    description: "Modern upgrades tailored to your lifestyle.",
    image: "https://static.wixstatic.com/media/c1b522_793480590e4c4bb1b9c2b17fa696c502~mv2.jpeg/v1/fill/w_334,h_457,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Dancoby_Conklin%20Bathroom_Shot%202_V3_1.jpeg",
    page: "ServiceKitchenBath"
  },
  {
    title: "Brownstone Restorations",
    description: "Preserving the charm, enhancing the function.",
    image: "https://static.wixstatic.com/media/c1b522_53439da5911740bcb80bd2033a393841~mv2.jpg/v1/fill/w_334,h_457,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/VAN_SARKI_STUDIO_8_PARK_SLOPE_2300.jpg",
    page: "ServiceBrownstone"
  },
  {
    title: "Townhouses & Apartments",
    description: "Expert craftsmanship for high-end residences.",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697c18d2dbda3b3101bfe937/1daef989a_villier_living2.jpg",
    page: "ServiceTownhouses"
  }
];

export default function ServicesParallaxSection({ fadeIn }) {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Transform scroll progress to horizontal movement (from right to left)
  const x = useTransform(scrollYProgress, [0, 1], ["100%", "0%"]);

  return (
    <section ref={containerRef} className="relative h-[300vh] bg-white">
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <motion.div {...fadeIn} className="text-center mb-12">
            <h2 className="text-sm uppercase tracking-widest text-gray-500 mb-4">Our Services</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">Full-Service Rejuvenation For Any Space</h3>
            <Button asChild variant="link" className="text-gray-900 hover:text-red-600">
              <Link to={createPageUrl('Contact')}>Learn More</Link>
            </Button>
          </motion.div>
        </div>

        <div className="relative w-full overflow-hidden">
          <motion.div 
            className="flex gap-8 px-6 md:px-12"
            style={{ x }}
          >
            {services.map((service, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 w-[280px] md:w-[320px] group"
              >
                <div className="block h-full">
                  <div className="relative overflow-hidden mb-6">
                    <img 
                      src={service.image}
                      alt={service.title}
                      className="w-full aspect-[3/4] object-cover group-hover:scale-[1.1] transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-700 z-20" />
                  </div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">{service.title}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}