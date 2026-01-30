import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';

export default function Home() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section 
        className="relative h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: 'url(https://static.wixstatic.com/media/c1b522_066e32d57b844b4893dd7de976dd6613~mv2.jpeg/v1/fill/w_1920,h_1080,fp_0.52_0.44,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/c1b522_066e32d57b844b4893dd7de976dd6613~mv2.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/50" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-center text-white px-6"
        >
          <div className="bg-white/95 backdrop-blur-sm inline-block px-16 py-20 max-w-2xl">
            <div className="border-t border-gray-800 w-32 mx-auto mb-10" />
            <h1 className="text-5xl md:text-6xl font-light text-gray-900 mb-2 tracking-tight leading-tight">
              Dancoby<br />Construction Company
            </h1>
            <p className="text-sm text-gray-600 tracking-[0.3em] uppercase mt-6">
              Sophisticated-Customer Centric-Transformations
            </p>
          </div>
        </motion.div>
      </section>

      {/* Who We Are */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeIn} className="text-center mb-20">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-[0.3em] mb-8">Who We Are</h2>
            <p className="text-2xl md:text-3xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-light">
              With over twenty years of experience and a dedication to customer satisfaction, we work with you, your budget, and your style to turn your renovation dreams into realities.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-16 items-center mt-32">
            <motion.div {...fadeIn}>
              <img 
                src="https://static.wixstatic.com/media/c1b522_74cf22378412427c8944f5e8a0fa3851~mv2.jpeg/v1/fill/w_366,h_654,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Dancoby_Penthouse%20Finished_Shot%209.jpeg"
                alt="Bar interior"
                className="w-full h-[700px] object-cover"
              />
            </motion.div>
            <motion.div {...fadeIn} className="space-y-8">
              <h3 className="text-4xl md:text-5xl font-light text-gray-900 leading-tight">
                Home is where the heart is.
              </h3>
              <p className="text-xl text-gray-600 leading-relaxed font-light">
                Which is why your space should promote cozy relaxation and evoke your unique personality and taste.
              </p>
              <p className="text-xl text-gray-600 leading-relaxed font-light">
                That's why our team of professionals provides a customer-centric experience with complete collaboration that ensures we turn your conceptual ideas into sophisticated transformations.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Kitchen Full Width Image */}
      <section>
        <motion.img 
          {...fadeIn}
          src="https://static.wixstatic.com/media/c1b522_30838463920a460186882c2d6dae4ad4~mv2.jpeg/v1/fill/w_451,h_870,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Dancoby_Penthouse%20Finished_Shot%2015.jpeg"
          alt="Kitchen"
          className="w-full h-[600px] md:h-[800px] object-cover"
        />
      </section>

      {/* Our Services */}
      <section className="py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeIn} className="text-center mb-20">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-[0.3em] mb-6">Our Services</h2>
            <h3 className="text-4xl md:text-5xl font-light text-gray-900 mb-12 leading-tight">
              Full-Service Rejuvenation For Any Space
            </h3>
            <Button asChild className="bg-gray-900 hover:bg-gray-800 text-white px-10 py-6 text-base font-light tracking-wide">
              <Link to={createPageUrl('Contact')}>Learn More</Link>
            </Button>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
            {[
              {
                title: "Interior Renovations",
                description: "Complete transformation of living spaces for form and function.",
                image: "https://static.wixstatic.com/media/c1b522_51ff5023986c46a88a21cb6a2bae4e3c~mv2.jpeg/v1/fill/w_334,h_457,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Dancoby_Penthouse%20Finished%20Shot%2017.jpeg"
              },
              {
                title: "Kitchen & Bath Remodeling",
                description: "Modern upgrades tailored to your lifestyle.",
                image: "https://static.wixstatic.com/media/c1b522_793480590e4c4bb1b9c2b17fa696c502~mv2.jpeg/v1/fill/w_334,h_457,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Dancoby_Conklin%20Bathroom_Shot%202_V3_1.jpeg"
              },
              {
                title: "Brownstone Restorations",
                description: "Preserving the charm, enhancing the function.",
                image: "https://static.wixstatic.com/media/c1b522_53439da5911740bcb80bd2033a393841~mv2.jpg/v1/fill/w_334,h_457,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/VAN_SARKI_STUDIO_8_PARK_SLOPE_2300.jpg"
              },
              {
                title: "Townhouses & Apartments",
                description: "Expert craftsmanship for high-end residences.",
                image: "https://static.wixstatic.com/media/c1b522_f3b8352ead454119b6fafb74781ff327~mv2.jpg/v1/fill/w_334,h_457,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/villier_living1_lightsoff.jpg"
              }
            ].map((service, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="relative h-[500px] overflow-hidden bg-gray-100 mb-6">
                  <img 
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">{service.title}</h4>
                <p className="text-gray-600 font-light">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Us */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div {...fadeIn} className="space-y-8">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-[0.3em]">About Us</h2>
              <h3 className="text-4xl md:text-5xl font-light text-gray-900 leading-tight">
                By working with your goals, budget, schedule, and lifestyle.
              </h3>
              <p className="text-2xl text-gray-600 font-light leading-relaxed">
                We will help you create an enviable space that you're proud to call home.
              </p>
              <Button asChild className="bg-gray-900 hover:bg-gray-800 text-white px-10 py-6 text-base font-light tracking-wide">
                <Link to={createPageUrl('About')}>Learn More</Link>
              </Button>
            </motion.div>
            <motion.div {...fadeIn}>
              <img 
                src="https://static.wixstatic.com/media/c1b522_38c04d6b49cb48ab8c1755d93f712bb4~mv2.jpeg/v1/fill/w_635,h_496,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Dancoby_Penthouse%20Finished_Shot%2013.jpeg"
                alt="Modern Kitchen"
                className="w-full h-[550px] object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Kitchen Wide Image */}
      <section>
        <motion.img 
          {...fadeIn}
          src="https://static.wixstatic.com/media/efb67d_a261152299dc4434a364c708901dffc5~mv2.jpg/v1/fill/w_1068,h_371,al_c,q_85,enc_avif,quality_auto/efb67d_a261152299dc4434a364c708901dffc5~mv2.jpg"
          alt="Kitchen"
          className="w-full h-[400px] object-cover"
        />
      </section>

      {/* Commitment to Perfection */}
      <section className="py-32 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div {...fadeIn} className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-light text-gray-900">Commitment to Perfection</h2>
            <p className="text-xl text-gray-600 leading-relaxed font-light">
              We don't merely strive for excellence…we strive for perfection on every project, every time. Our passion resonates in everything we do from our friendly smile to our attention to detail, collaborative approach, and commitment to a flawless result.
            </p>
            <p className="text-xl text-gray-600 leading-relaxed font-light">
              Plus, our contractors are licensed and insured so you are always protected. Our dedication to you, the customer, means we encourage open, honest communication throughout the collaborative process from concept to completion.
            </p>
            <Button asChild className="bg-gray-900 hover:bg-gray-800 text-white px-10 py-6 text-base font-light tracking-wide mt-8">
              <Link to={createPageUrl('About')}>Learn More</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Client Testimonials */}
      <section className="py-32 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div {...fadeIn}>
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-[0.3em] mb-16">Client Testimonials</h2>
            
            <div className="bg-white p-12 md:p-16">
              <div className="mb-8">
                <div className="w-20 h-20 bg-gray-900 text-white rounded-full flex items-center justify-center text-3xl font-light mx-auto">
                  A
                </div>
              </div>
              <p className="text-xl text-gray-700 leading-relaxed mb-8 font-light italic">
                "Dancoby Construction did an absolutely incredible job renovating our entire home and they finished ON TIME! The owner, Ralph Abekassis, is open, transparent, fair and respectful. He was very communicative with regular onsite meetings, very clear around any changes or issues and while we were away he sent us daily updates with pictures on progress"
              </p>
              <p className="text-gray-900 font-medium text-lg">Amanda O</p>
              <p className="text-gray-500 text-sm mt-1">Homeowner, Brooklyn, NY</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Projects */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeIn} className="text-center mb-20">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-[0.3em] mb-6">Our Projects</h2>
            <h3 className="text-4xl md:text-5xl font-light text-gray-900 mb-8 leading-tight">
              Envision Your Upgrade with 3D Rendering and Expert Floor Planning
            </h3>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light mb-4">
              It can be difficult to visualize what your transformations will look like, which is why we offer life-like 3D rendering that ensures we are on the same page and that we incorporate all the features, designs, styles, and materials you want.
            </p>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light mb-12">
              Using our customer-centric and collaborative approach, we can turn your concept into a mock-up so you can enter any new project trusting that the final result will exceed your expectations.
            </p>
            <Button asChild className="bg-gray-900 hover:bg-gray-800 text-white px-10 py-6 text-base font-light tracking-wide">
              <Link to={createPageUrl('Projects')}>Learn More</Link>
            </Button>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mt-20">
            {[
              {
                title: "The Garden",
                image: "https://static.wixstatic.com/media/c1b522_0463b4b57a704427b7c60a57afd204b4~mv2.jpg/v1/fill/w_445,h_520,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/VAN_SARKI_STUDIO_8_PARK_SLOPE_2269%201.jpg"
              },
              {
                title: "Penthouse A",
                image: "https://static.wixstatic.com/media/c1b522_d14a164578e44c94b12a1805090ad37e~mv2.jpeg/v1/fill/w_445,h_520,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Dancoby_Penthouse%20Finished%20Shot%2020%20-%20V2.jpeg"
              },
              {
                title: "So Suite",
                image: "https://static.wixstatic.com/media/c1b522_ad38c506d35e4fd6a819d8702ad6b680~mv2.jpg/v1/fill/w_445,h_520,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Dancoby_849%20Central_15.jpg"
              }
            ].map((project, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="relative h-[600px] overflow-hidden bg-gray-100 mb-6">
                  <img 
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">{project.title}</h4>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Blog */}
      <section className="py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeIn} className="text-center mb-20">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-[0.3em] mb-6">Our Blogs</h2>
            <h3 className="text-4xl md:text-5xl font-light text-gray-900">Latest Updates</h3>
          </motion.div>

          <motion.div {...fadeIn}>
            <div className="bg-white overflow-hidden max-w-5xl mx-auto">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="h-full">
                  <img 
                    src="https://static.wixstatic.com/media/c1b522_ef142567bb894db394ca2e7f4fadca32~mv2.webp/v1/fill/w_980,h_429,al_c,q_90,enc_avif,quality_auto/c1b522_ef142567bb894db394ca2e7f4fadca32~mv2.webp"
                    alt="Blog post"
                    className="w-full h-full object-cover min-h-[400px]"
                  />
                </div>
                <div className="p-12 flex flex-col justify-center">
                  <h4 className="text-2xl font-light text-gray-900 mb-6 leading-tight">
                    The Insider: Park Slope Reno Yields Airy, Clutter-Free Apartment
                  </h4>
                  <p className="text-gray-600 leading-relaxed mb-6 font-light">
                    A rethink of a prewar walkup leveled ceilings and floors and created built-in storage for its minimalist occupants. by Cara Greenberg...
                  </p>
                  <p className="text-sm text-gray-500 font-light">Aug 1, 2025 • 3 min read</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div {...fadeIn}>
            <h2 className="text-4xl md:text-5xl font-light mb-8">Ready to Transform Your Space?</h2>
            <p className="text-xl text-gray-300 mb-12 font-light">
              Let's turn your renovation dreams into reality
            </p>
            <Button asChild size="lg" className="bg-white text-gray-900 hover:bg-gray-100 px-12 py-7 text-lg font-light tracking-wide">
              <Link to={createPageUrl('Contact')}>Get Started</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}