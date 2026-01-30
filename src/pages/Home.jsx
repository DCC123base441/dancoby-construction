import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { ArrowRight, Award, Shield, Users } from 'lucide-react';

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* Custom Cursor */}
      <motion.div
        className="hidden lg:block fixed w-4 h-4 rounded-full border-2 border-amber-500/50 pointer-events-none z-[9999] mix-blend-difference"
        animate={{ x: mousePosition.x - 8, y: mousePosition.y - 8 }}
        transition={{ type: "spring", damping: 30, stiffness: 200 }}
      />

      {/* Hero Section with Parallax */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div 
          className="absolute inset-0"
          style={{ y: heroY }}
        >
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: 'url(https://static.wixstatic.com/media/c1b522_066e32d57b844b4893dd7de976dd6613~mv2.jpeg/v1/fill/w_1920,h_1080,fp_0.52_0.44,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/c1b522_066e32d57b844b4893dd7de976dd6613~mv2.jpeg)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#0a0a0a]" />
        </motion.div>

        <motion.div 
          className="relative z-10 text-center px-6 max-w-5xl"
          style={{ opacity: heroOpacity }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-block bg-gradient-to-br from-zinc-900/90 to-zinc-800/80 backdrop-blur-xl px-20 py-24 border border-amber-500/20">
              <div className="h-px w-24 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mb-12" />
              
              <motion.h1 
                className="text-7xl md:text-8xl font-extralight tracking-tight mb-4 bg-gradient-to-br from-white via-amber-50 to-amber-200 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 1 }}
              >
                Dancoby
              </motion.h1>
              
              <motion.p 
                className="text-2xl font-light tracking-[0.15em] text-zinc-300 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 1 }}
              >
                Construction Company
              </motion.p>
              
              <motion.div 
                className="h-px w-32 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent mx-auto mb-8"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.9, duration: 0.8 }}
              />
              
              <motion.p 
                className="text-xs uppercase tracking-[0.4em] text-amber-200/80"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 1 }}
              >
                Sophisticated · Customer Centric · Transformations
              </motion.p>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <span className="text-xs uppercase tracking-[0.3em] text-zinc-400">Scroll</span>
          <motion.div 
            className="w-px h-16 bg-gradient-to-b from-amber-500/50 to-transparent"
            animate={{ scaleY: [1, 1.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </section>

      {/* Who We Are Section */}
      <section className="py-40 bg-gradient-to-b from-[#0a0a0a] to-zinc-900">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeInUp} className="text-center mb-32">
            <span className="text-xs uppercase tracking-[0.4em] text-amber-500 font-light">Who We Are</span>
            <div className="h-px w-16 bg-amber-500/30 mx-auto mt-6 mb-12" />
            <h2 className="text-4xl md:text-5xl font-extralight text-zinc-100 max-w-5xl mx-auto leading-relaxed">
              With over <span className="text-amber-400">twenty years</span> of experience and a dedication to customer satisfaction, we work with you, your budget, and your style to turn your renovation dreams into <span className="text-amber-400">realities</span>.
            </h2>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div 
              {...fadeInUp}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.6 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <img 
                src="https://static.wixstatic.com/media/c1b522_74cf22378412427c8944f5e8a0fa3851~mv2.jpeg/v1/fill/w_366,h_654,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Dancoby_Penthouse%20Finished_Shot%209.jpeg"
                alt="Bar interior"
                className="w-full h-[750px] object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
              />
            </motion.div>

            <motion.div {...fadeInUp} className="space-y-8">
              <h3 className="text-5xl font-extralight text-zinc-100 leading-tight">
                Home is where the <span className="italic text-amber-400">heart</span> is.
              </h3>
              <div className="h-px w-24 bg-gradient-to-r from-amber-500 to-transparent" />
              <p className="text-xl text-zinc-400 leading-relaxed font-light">
                Which is why your space should promote cozy relaxation and evoke your unique personality and taste.
              </p>
              <p className="text-xl text-zinc-400 leading-relaxed font-light">
                That's why our team of professionals provides a customer-centric experience with complete collaboration that ensures we turn your conceptual ideas into sophisticated transformations.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Parallax Image Divider */}
      <motion.section 
        className="relative h-[70vh] overflow-hidden"
        style={{ y: useTransform(scrollY, [1000, 2000], [0, 100]) }}
      >
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{
            backgroundImage: 'url(https://static.wixstatic.com/media/c1b522_30838463920a460186882c2d6dae4ad4~mv2.jpeg/v1/fill/w_451,h_870,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Dancoby_Penthouse%20Finished_Shot%2015.jpeg)',
          }}
        />
        <div className="absolute inset-0 bg-black/50" />
      </motion.section>

      {/* Our Services */}
      <section className="py-40 bg-zinc-900">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeInUp} className="text-center mb-32">
            <span className="text-xs uppercase tracking-[0.4em] text-amber-500 font-light">Our Services</span>
            <div className="h-px w-16 bg-amber-500/30 mx-auto mt-6 mb-12" />
            <h2 className="text-5xl md:text-6xl font-extralight text-zinc-100 mb-12 leading-tight">
              Full-Service Rejuvenation<br />For Any Space
            </h2>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button asChild className="bg-transparent border border-amber-500/50 hover:bg-amber-500/20 text-amber-400 px-10 py-7 text-sm uppercase tracking-[0.3em] font-light group">
                <Link to={createPageUrl('Contact')}>
                  Explore Services
                  <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-2 transition-transform" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          <motion.div 
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              {
                title: "Interior Renovations",
                description: "Complete transformation of living spaces for form and function.",
                image: "https://static.wixstatic.com/media/c1b522_51ff5023986c46a88a21cb6a2bae4e3c~mv2.jpeg/v1/fill/w_334,h_457,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Dancoby_Penthouse%20Finished%20Shot%2017.jpeg"
              },
              {
                title: "Kitchen & Bath",
                description: "Modern upgrades tailored to your lifestyle.",
                image: "https://static.wixstatic.com/media/c1b522_793480590e4c4bb1b9c2b17fa696c502~mv2.jpeg/v1/fill/w_334,h_457,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Dancoby_Conklin%20Bathroom_Shot%202_V3_1.jpeg"
              },
              {
                title: "Brownstone Restorations",
                description: "Preserving charm, enhancing function.",
                image: "https://static.wixstatic.com/media/c1b522_53439da5911740bcb80bd2033a393841~mv2.jpg/v1/fill/w_334,h_457,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/VAN_SARKI_STUDIO_8_PARK_SLOPE_2300.jpg"
              },
              {
                title: "Townhouses & Apartments",
                description: "Expert craftsmanship for residences.",
                image: "https://static.wixstatic.com/media/c1b522_f3b8352ead454119b6fafb74781ff327~mv2.jpg/v1/fill/w_334,h_457,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/villier_living1_lightsoff.jpg"
              }
            ].map((service, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="group cursor-pointer"
              >
                <div className="relative h-[550px] overflow-hidden bg-zinc-800 mb-6">
                  <motion.img 
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500"
                  >
                    <div className="h-px w-12 bg-amber-500 mb-3" />
                    <p className="text-sm text-zinc-300 font-light">{service.description}</p>
                  </motion.div>
                </div>
                <h4 className="text-sm uppercase tracking-[0.2em] text-zinc-300 font-light group-hover:text-amber-400 transition-colors">
                  {service.title}
                </h4>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-32 bg-[#0a0a0a] border-y border-amber-500/10">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-16 text-center"
          >
            {[
              { icon: Award, label: "Years Experience", value: "20+" },
              { icon: Users, label: "Happy Clients", value: "500+" },
              { icon: Shield, label: "Year Warranty", value: "5" }
            ].map((stat, idx) => (
              <motion.div key={idx} variants={fadeInUp}>
                <stat.icon className="w-12 h-12 text-amber-500 mx-auto mb-6" />
                <motion.div 
                  className="text-6xl font-extralight text-zinc-100 mb-3"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.2, duration: 0.8 }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-sm uppercase tracking-[0.3em] text-zinc-500 font-light">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Commitment Section */}
      <section className="py-40 bg-gradient-to-b from-zinc-900 to-[#0a0a0a]">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div {...fadeInUp} className="text-center space-y-8">
            <span className="text-xs uppercase tracking-[0.4em] text-amber-500 font-light">Our Promise</span>
            <div className="h-px w-16 bg-amber-500/30 mx-auto" />
            <h2 className="text-5xl md:text-6xl font-extralight text-zinc-100 leading-tight">
              Commitment to <span className="italic text-amber-400">Perfection</span>
            </h2>
            <p className="text-xl text-zinc-400 leading-relaxed font-light max-w-4xl mx-auto">
              We don't merely strive for excellence…we strive for perfection on every project, every time. Our passion resonates in everything we do from our friendly smile to our attention to detail, collaborative approach, and commitment to a flawless result.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button asChild className="bg-amber-500 hover:bg-amber-600 text-zinc-900 px-10 py-7 text-sm uppercase tracking-[0.3em] font-medium group mt-8">
                <Link to={createPageUrl('About')}>
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-2 transition-transform" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-40 bg-zinc-900/50">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div {...fadeInUp} className="text-center">
            <span className="text-xs uppercase tracking-[0.4em] text-amber-500 font-light mb-12 block">Client Testimonials</span>
            
            <div className="bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 backdrop-blur-sm p-16 border border-amber-500/10">
              <div className="mb-8">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-zinc-900 text-3xl font-light mx-auto">
                  A
                </div>
              </div>
              <p className="text-2xl text-zinc-300 leading-relaxed mb-8 font-light italic">
                "Dancoby Construction did an absolutely incredible job renovating our entire home and they finished ON TIME! Ralph is open, transparent, fair and respectful."
              </p>
              <div className="h-px w-24 bg-amber-500/30 mx-auto mb-6" />
              <p className="text-zinc-100 font-light text-lg">Amanda O</p>
              <p className="text-zinc-500 text-sm mt-2 uppercase tracking-wider">Brooklyn, NY</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Projects Preview */}
      <section className="py-40 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeInUp} className="text-center mb-32">
            <span className="text-xs uppercase tracking-[0.4em] text-amber-500 font-light">Our Projects</span>
            <div className="h-px w-16 bg-amber-500/30 mx-auto mt-6 mb-12" />
            <h2 className="text-5xl md:text-6xl font-extralight text-zinc-100 mb-12 leading-tight">
              Sophisticated<br />Transformations
            </h2>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button asChild className="bg-transparent border border-amber-500/50 hover:bg-amber-500/20 text-amber-400 px-10 py-7 text-sm uppercase tracking-[0.3em] font-light group">
                <Link to={createPageUrl('Projects')}>
                  View Portfolio
                  <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-2 transition-transform" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          <motion.div 
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
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
                variants={fadeInUp}
                className="group cursor-pointer"
              >
                <div className="relative h-[650px] overflow-hidden bg-zinc-800">
                  <motion.img 
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.6 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-50 group-hover:opacity-80 transition-opacity duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <div className="h-px w-12 bg-amber-500 mb-4 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                    <h4 className="text-xl uppercase tracking-[0.2em] text-white font-light">{project.title}</h4>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent" />
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <motion.div {...fadeInUp}>
            <h2 className="text-5xl md:text-7xl font-extralight text-zinc-100 mb-8 leading-tight">
              Ready to Transform<br />Your <span className="italic text-amber-400">Space</span>?
            </h2>
            <p className="text-xl text-zinc-400 mb-16 font-light">
              Let's turn your renovation dreams into reality
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button asChild size="lg" className="bg-amber-500 hover:bg-amber-600 text-zinc-900 px-16 py-8 text-base uppercase tracking-[0.3em] font-medium group">
                <Link to={createPageUrl('Contact')}>
                  Get Started
                  <ArrowRight className="w-5 h-5 ml-4 group-hover:translate-x-2 transition-transform" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}