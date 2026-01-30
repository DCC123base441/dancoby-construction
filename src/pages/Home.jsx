import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Home() {
  const fadeIn = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, 0]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] bg-gradient-to-br from-blue-200/40 to-indigo-200/40 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, -5, 0]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-purple-200/40 to-pink-200/40 rounded-full blur-3xl"
          />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.25, 0.4, 0.25, 1] }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-full text-sm mb-8"
            >
              <Sparkles className="w-4 h-4" />
              <span>Sophisticated Construction Since 2004</span>
            </motion.div>

            <h1 className="text-7xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
              Dancoby
            </h1>
            
            <p className="text-2xl md:text-3xl text-slate-600 mb-4 font-medium">
              Construction Company
            </p>
            
            <div className="flex items-center justify-center gap-2 mb-12">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-blue-400" />
              <p className="text-sm text-slate-500 uppercase tracking-wider">
                Customer Centric · Transformations
              </p>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-blue-400" />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="flex flex-wrap gap-4 justify-center"
            >
              <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-6 text-lg rounded-full shadow-lg shadow-blue-200 group">
                <Link to={createPageUrl('Contact')}>
                  Start Your Project
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-2 border-slate-300 hover:border-blue-600 hover:text-blue-600 px-8 py-6 text-lg rounded-full">
                <Link to={createPageUrl('Projects')}>View Portfolio</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeIn} className="text-center mb-24">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Who We Are</span>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mt-4 mb-6 max-w-4xl mx-auto leading-tight">
              Turning renovation dreams into <span className="text-blue-600">reality</span> for over 20 years
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              We work with your budget and style to create spaces that truly feel like home
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              {...fadeIn}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-3xl transform rotate-3 group-hover:rotate-6 transition-transform duration-500" />
              <img 
                src="https://static.wixstatic.com/media/c1b522_74cf22378412427c8944f5e8a0fa3851~mv2.jpeg/v1/fill/w_366,h_654,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Dancoby_Penthouse%20Finished_Shot%209.jpeg"
                alt="Interior"
                className="relative w-full h-[650px] object-cover rounded-3xl shadow-2xl"
              />
            </motion.div>

            <motion.div {...fadeIn} className="space-y-6">
              <h3 className="text-4xl font-bold text-slate-900">
                Home is where the heart is
              </h3>
              <div className="h-1 w-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full" />
              <p className="text-lg text-slate-600 leading-relaxed">
                Your space should promote cozy relaxation and evoke your unique personality and taste.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed">
                Our team provides a customer-centric experience with complete collaboration, turning your conceptual ideas into sophisticated transformations.
              </p>
              <Button asChild className="bg-slate-900 hover:bg-slate-800 text-white rounded-full px-8 py-6 mt-6 group">
                <Link to={createPageUrl('About')}>
                  Learn More About Us
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Image Showcase */}
      <section className="py-16">
        <motion.div {...fadeIn} className="relative h-[600px] overflow-hidden">
          <img 
            src="https://static.wixstatic.com/media/c1b522_30838463920a460186882c2d6dae4ad4~mv2.jpeg/v1/fill/w_451,h_870,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Dancoby_Penthouse%20Finished_Shot%2015.jpeg"
            alt="Kitchen"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
        </motion.div>
      </section>

      {/* Services */}
      <section className="py-32 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeIn} className="text-center mb-20">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Our Services</span>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mt-4 mb-8">
              Full-Service Rejuvenation
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10">
              Expert craftsmanship for every space in your home
            </p>
            <Button asChild className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full px-8 py-6 shadow-lg shadow-blue-200">
              <Link to={createPageUrl('Contact')}>Explore Services</Link>
            </Button>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Interior Renovations",
                description: "Complete transformation of living spaces",
                image: "https://static.wixstatic.com/media/c1b522_51ff5023986c46a88a21cb6a2bae4e3c~mv2.jpeg/v1/fill/w_334,h_457,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Dancoby_Penthouse%20Finished%20Shot%2017.jpeg"
              },
              {
                title: "Kitchen & Bath",
                description: "Modern upgrades for daily living",
                image: "https://static.wixstatic.com/media/c1b522_793480590e4c4bb1b9c2b17fa696c502~mv2.jpeg/v1/fill/w_334,h_457,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Dancoby_Conklin%20Bathroom_Shot%202_V3_1.jpeg"
              },
              {
                title: "Brownstone Restoration",
                description: "Preserving charm, enhancing function",
                image: "https://static.wixstatic.com/media/c1b522_53439da5911740bcb80bd2033a393841~mv2.jpg/v1/fill/w_334,h_457,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/VAN_SARKI_STUDIO_8_PARK_SLOPE_2300.jpg"
              },
              {
                title: "Townhouses & Apartments",
                description: "Expert residential craftsmanship",
                image: "https://static.wixstatic.com/media/c1b522_f3b8352ead454119b6fafb74781ff327~mv2.jpg/v1/fill/w_334,h_457,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/villier_living1_lightsoff.jpg"
              }
            ].map((service, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -8 }}
                className="group cursor-pointer bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div className="relative h-80 overflow-hidden">
                  <img 
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-6">
                  <h4 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {service.title}
                  </h4>
                  <p className="text-slate-600">{service.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            {[
              { value: "20+", label: "Years of Excellence" },
              { value: "500+", label: "Happy Clients" },
              { value: "5 Year", label: "Warranty" }
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2, type: "spring" }}
              >
                <div className="text-6xl font-bold mb-3">{stat.value}</div>
                <div className="text-xl text-blue-100">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Commitment */}
      <section className="py-32 bg-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.div {...fadeIn}>
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Our Promise</span>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mt-4 mb-8">
              Commitment to Perfection
            </h2>
            <p className="text-xl text-slate-600 leading-relaxed mb-6">
              We don't merely strive for excellence…we strive for perfection on every project, every time. Our passion resonates in everything we do.
            </p>
            <p className="text-xl text-slate-600 leading-relaxed mb-10">
              Our contractors are licensed and insured. We encourage open, honest communication throughout the collaborative process from concept to completion.
            </p>
            <Button asChild size="lg" className="bg-slate-900 hover:bg-slate-800 text-white rounded-full px-10 py-6 group">
              <Link to={createPageUrl('About')}>
                Learn More
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-32 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div {...fadeIn} className="text-center">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-8 block">What Clients Say</span>
            
            <div className="bg-white rounded-3xl p-12 shadow-xl">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-8">
                A
              </div>
              <p className="text-2xl text-slate-700 leading-relaxed mb-8">
                "Dancoby Construction did an absolutely incredible job renovating our entire home and they finished ON TIME! Ralph is open, transparent, fair and respectful."
              </p>
              <div className="h-1 w-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mx-auto mb-6" />
              <p className="text-slate-900 font-bold text-lg">Amanda O</p>
              <p className="text-slate-500">Brooklyn, NY</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Projects */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeIn} className="text-center mb-20">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Our Work</span>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mt-4 mb-8">
              Sophisticated Transformations
            </h2>
            <Button asChild className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full px-8 py-6 shadow-lg shadow-blue-200">
              <Link to={createPageUrl('Projects')}>View Full Portfolio</Link>
            </Button>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
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
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -8 }}
                className="group cursor-pointer bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div className="relative h-96 overflow-hidden">
                  <img 
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                    <h4 className="text-xl font-bold text-white">{project.title}</h4>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
            transition={{ duration: 30, repeat: Infinity }}
            className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
          />
        </div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div {...fadeIn}>
            <h2 className="text-5xl md:text-6xl font-bold mb-8">
              Ready to Transform Your Space?
            </h2>
            <p className="text-2xl mb-12 text-blue-100">
              Let's turn your renovation dreams into reality
            </p>
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50 rounded-full px-12 py-8 text-xl font-bold shadow-2xl group">
              <Link to={createPageUrl('Contact')}>
                Get Started Today
                <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}