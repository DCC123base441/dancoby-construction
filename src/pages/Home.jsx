import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroProjects = [
    {
      title: "Sophisticated, Customer-Centric Transformations",
      location: "Dancoby Construction Company",
      image: "https://static.wixstatic.com/media/c1b522_066e32d57b844b4893dd7de976dd6613~mv2.jpeg/v1/fill/w_1920,h_1080,fp_0.52_0.44,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/c1b522_066e32d57b844b4893dd7de976dd6613~mv2.jpeg"
    },
    {
      title: "Complete kitchen and living space renovation blending modern functionality with timeless elegance",
      location: "Park Slope Townhouse / Brooklyn, NY",
      image: "https://static.wixstatic.com/media/c1b522_74cf22378412427c8944f5e8a0fa3851~mv2.jpeg/v1/fill/w_366,h_654,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Dancoby_Penthouse%20Finished_Shot%209.jpeg"
    },
    {
      title: "Full interior renovation of a Manhattan apartment featuring custom cabinetry and premium finishes",
      location: "Upper West Side Apartment / Manhattan, NY",
      image: "https://static.wixstatic.com/media/c1b522_30838463920a460186882c2d6dae4ad4~mv2.jpeg/v1/fill/w_451,h_870,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Dancoby_Penthouse%20Finished_Shot%2015.jpeg"
    }
  ];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroProjects.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroProjects.length) % heroProjects.length);

  const fadeIn = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Slider */}
      <section className="relative h-screen overflow-hidden">
        {heroProjects.map((project, idx) => (
          <motion.div
            key={idx}
            initial={false}
            animate={{
              opacity: currentSlide === idx ? 1 : 0,
              scale: currentSlide === idx ? 1 : 1.1
            }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0"
            style={{ pointerEvents: currentSlide === idx ? 'auto' : 'none' }}
          >
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${project.image})` }}
            />
            <div className="absolute inset-0 bg-black/40" />
          </motion.div>
        ))}

        {/* Slide Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-6 w-full">
            <div className="max-w-2xl">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="h-1 w-16 bg-red-600 mb-6" />
                <p className="text-white/90 text-base uppercase tracking-wider mb-4">
                  {heroProjects[currentSlide].location}
                </p>
                <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-8">
                  {heroProjects[currentSlide].title}
                </h1>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <div className="absolute bottom-12 left-6 z-20 flex gap-3">
          <button 
            onClick={prevSlide}
            className="w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/30 hover:bg-white/20 flex items-center justify-center transition-all"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button 
            onClick={nextSlide}
            className="w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/30 hover:bg-white/20 flex items-center justify-center transition-all"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </div>
      </section>

      {/* About Section */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div {...fadeIn}>
              <img 
                src="https://static.wixstatic.com/media/efb67d_56ea9dfe4a0f437a8bc6abb241a18a24~mv2.jpeg/v1/fill/w_551,h_493,fp_0.54_0.31,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Favorite-Aragon-Headshot-94.jpeg"
                alt="About Dancoby"
                className="w-full h-[600px] object-cover"
              />
            </motion.div>

            <motion.div {...fadeIn} className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Sophisticated, Customer-Centric Transformations
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  For over 20 years, Dancoby Construction has been transforming homes and commercial spaces across Brooklyn, Manhattan, and beyond. We specialize in creating sophisticated renovations that blend timeless design with modern functionality, all while maintaining your budget and timeline.
                </p>
                <p>
                  Our team of licensed professionals approaches every project with passion and meticulous attention to detail. Whether it's a luxury bathroom renovation, full kitchen remodel, or complete interior transformation, we're committed to exceeding expectations on every job.
                </p>
              </div>
              <Button asChild className="bg-gray-900 hover:bg-gray-800 text-white mt-6">
                <Link to={createPageUrl('About')}>About Us</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Awards Banner */}
      <section className="py-16 bg-red-600">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeIn} className="text-center">
            <p className="text-white/90 text-sm uppercase tracking-wider mb-3">
              Award-Winning Excellence
            </p>
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-4">
              5-Year Warranty on All Projects
            </h3>
            <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-red-600 transition-all">
              Read More
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Featured Projects Grid */}
      <section className="py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Master bathroom renovation with heated marble floors and custom vanity cabinetry",
                logo: "Luxury Bath Remodel",
                image: "https://static.wixstatic.com/media/c1b522_51ff5023986c46a88a21cb6a2bae4e3c~mv2.jpeg/v1/fill/w_334,h_457,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Dancoby_Penthouse%20Finished%20Shot%2017.jpeg"
              },
              {
                title: "Open-concept kitchen and living space with custom millwork and premium finishes",
                logo: "Kitchen + Living Renovation",
                image: "https://static.wixstatic.com/media/c1b522_793480590e4c4bb1b9c2b17fa696c502~mv2.jpeg/v1/fill/w_334,h_457,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Dancoby_Conklin%20Bathroom_Shot%202_V3_1.jpeg"
              },
              {
                title: "Complete brownstone interior transformation with custom architectural details",
                logo: "Brownstone Restoration",
                image: "https://static.wixstatic.com/media/c1b522_53439da5911740bcb80bd2033a393841~mv2.jpg/v1/fill/w_334,h_457,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/VAN_SARKI_STUDIO_8_PARK_SLOPE_2300.jpg"
              },
              {
                title: "Penthouse renovation featuring floor-to-ceiling windows and custom design elements",
                logo: "Penthouse Upgrade",
                image: "https://static.wixstatic.com/media/c1b522_f3b8352ead454119b6fafb74781ff327~mv2.jpg/v1/fill/w_334,h_457,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/villier_living1_lightsoff.jpg"
              }
            ].map((project, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden mb-6 bg-gray-200">
                  <img 
                    src={project.image}
                    alt={project.logo}
                    className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300" />
                </div>
                
                <div className="space-y-4">
                  <div className="h-12 flex items-center">
                    <div className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      {project.logo}
                    </div>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 leading-tight">
                    {project.title}
                  </h3>
                  <Button variant="link" className="text-gray-900 hover:text-red-600 p-0 h-auto font-normal">
                    View Project
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-16">
            <Button asChild className="bg-gray-900 hover:bg-gray-800 text-white px-8">
              <Link to={createPageUrl('Projects')}>Featured Projects</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12">
            {[
              { number: "#1", label: "RETAIL CONTRACTOR", sublabel: "by ENR East in 2025" },
              { number: "#32", label: "BEST PLACES TO WORK", sublabel: "by Crain's New York in 2025" },
              { number: "#4", label: "TOP 90 RETAIL GIANTS", sublabel: "by BD+C Magazine in 2025" },
              { number: "Platinum", label: "NATIONAL SAFETY AWARD", sublabel: "by ABC in 2025" }
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center"
              >
                <div className="text-5xl font-bold text-red-600 mb-3">{stat.number}</div>
                <div className="text-sm font-bold text-gray-900 mb-1">{stat.label}</div>
                <div className="text-xs text-gray-500">{stat.sublabel}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div {...fadeIn}>
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              Transform Your Space Into Something Extraordinary
            </h2>
            <p className="text-xl text-gray-300 mb-12">
              Let's create your perfect home with sophisticated design and expert craftsmanship
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg" className="bg-red-600 hover:bg-red-700 text-white px-10">
                <Link to={createPageUrl('Contact')}>Get Started</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-gray-900">
                <Link to={createPageUrl('Projects')}>View Projects</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}