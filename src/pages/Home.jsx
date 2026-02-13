import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

import EstimatorButton from '../components/EstimatorButton';
import VibrantExternalLink from '../components/VibrantExternalLink';
import TestimonialsSection from '../components/TestimonialsSection';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import SEOHead from '../components/SEOHead';
import TrustBadges from '../components/TrustBadges';
import CurrentProjectCard from '../components/home/CurrentProjectCard';
import CurrentProjectsSkeleton from '../components/home/CurrentProjectsSkeleton';
import HeroImageFade from '../components/home/HeroImageFade';



export default function Home() {
  const heroRef = useRef(null);
  const awardsRef = useRef(null);
  const ctaRef = useRef(null);

  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const { scrollYProgress: awardsScrollProgress } = useScroll({
    target: awardsRef,
    offset: ["start end", "end start"]
  });

  const { scrollYProgress: ctaScrollProgress } = useScroll({
    target: ctaRef,
    offset: ["start end", "end start"]
  });

  const heroY = useTransform(heroScrollProgress, [0, 1], ["0%", "30%"]);
  const heroScale = useTransform(heroScrollProgress, [0, 1], [1, 1.1]);
  const awardsY = useTransform(awardsScrollProgress, [0, 1], ["0%", "20%"]);
  const ctaY = useTransform(ctaScrollProgress, [0, 1], ["0%", "15%"]);

  const fadeIn = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  const { data: currentProjects = [], isLoading: isLoadingProjects } = useQuery({
    queryKey: ['currentProjects'],
    queryFn: () => base44.entities.CurrentProject.list('order')
  });



  const homeProjects = currentProjects.filter((p) => p.featuredOnHome);

  return (
    <main className="min-h-screen bg-white">
      <SEOHead
        title="Dancoby Construction | Sophisticated Home Renovations NYC"
        description="Transform your home with NYC's premier renovation experts. Specializing in high-end kitchens, bathrooms, and brownstone restorations. 20+ years of excellence."
        keywords="home renovation Brooklyn, kitchen remodeling NYC, bathroom renovation New York, brownstone restoration, interior renovation contractor, construction company Brooklyn, NYC general contractor, home remodeling Long Island, luxury renovation NYC, residential contractor New York, house renovation near me, best general contractor Brooklyn, full home renovation NYC, apartment renovation Manhattan, condo renovation Brooklyn"
        ogImage="https://static.wixstatic.com/media/c1b522_066e32d57b844b4893dd7de976dd6613~mv2.jpeg/v1/fill/w_1200,h_630,al_c,q_90/c1b522_066e32d57b844b4893dd7de976dd6613~mv2.jpeg" />

      {/* Hero Section */}
              <section ref={heroRef} className="relative h-screen overflow-hidden">
                <motion.div
          className="absolute inset-0"
          style={{
            y: heroY,
            scale: heroScale
          }}>

                  <HeroImageFade />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />

                <div className="relative z-10 h-full flex items-center">
                  <div className="max-w-7xl mx-auto px-6 w-full">
                    <div className="max-w-2xl">
                      <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="-mt-48 max-w-lg">

                        <motion.div
                  className="h-px w-16 bg-gradient-to-r from-red-500 to-red-600 mb-6"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  style={{ transformOrigin: 'left' }} />

                        <motion.p
                  className="text-white/70 text-[10px] md:text-xs uppercase tracking-[0.3em] mb-4 font-light"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}>

                          Dancoby Construction Company
                        </motion.p>
                        <motion.h1
                  className="text-3xl md:text-5xl lg:text-6xl font-extralight tracking-wide text-white leading-[1.15] mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.7 }}>

                          Sophisticated,<br /><em className="italic font-light text-white/90">Customer-Centric</em><br />Transformations
                        </motion.h1>
                        <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1 }}>

                          <EstimatorButton size="large" />
                        </motion.div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </section>

      {/* Who We Are Section */}
      <section className="py-16 md:py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-stretch">
            {/* Text Content */}
            <motion.div {...fadeIn} className="flex flex-col justify-end h-full">
              <div className="space-y-8">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-widest text-red-600 mb-3">Who We Are</h2>
                  <h3 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                    Home is where the heart is.
                  </h3>
                </div>
                
                <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
                  <p>With over twenty years of experience and a true dedication to customer satisfaction, we partner with you—your budget, your style, your vision—to turn renovation dreams into reality.</p>
                  <p>Your space should feel cozy, relaxing, and distinctly yours, reflecting your unique personality and taste.</p>
                  <p>That's why our professional team delivers a fully collaborative, customer-first experience, working closely with you to transform your ideas into elegant, high-quality results.</p>
                </div>
              </div>
            </motion.div>

            {/* Images */}
            <motion.div {...fadeIn} className="relative h-full">
              <div className="grid grid-cols-2 gap-6 h-full">
                <div className="h-full">
                  <img
                    src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697c18d2dbda3b3101bfe937/99a553c33_Dancoby_PenthouseFinished_Shot9.jpg"
                    alt="Living Room"
                    className="w-full h-full shadow-xl object-cover"
                    loading="lazy"
                    decoding="async" />

                </div>
                <div className="h-full">
                  <img
                    src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697c18d2dbda3b3101bfe937/01286028a_Dancoby_PenthouseFinished_Shot15.jpg"
                    alt="Kitchen"
                    className="w-full h-full shadow-xl object-cover"
                    loading="lazy"
                    decoding="async" />

                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Services Section */}
            <section className="bg-slate-50 py-16 md:py-24">
              <div className="max-w-7xl mx-auto px-6">
                <motion.div {...fadeIn} className="text-center mb-20 mx-auto">
                  <h2 className="text-sm uppercase tracking-widest text-gray-500 mb-4">Our Services</h2>
                  <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">Full-Service Rejuvenation For Any Space</h3>
                  <Button asChild variant="link" className="text-gray-900 hover:text-red-600">
                    <Link to={createPageUrl('Services')}>Learn More</Link>
                  </Button>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {[
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
            }].
            map((service, idx) =>
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="">

                      <div className="block h-full">
                        <div className="relative overflow-hidden mb-6">
                          <img
                    src={service.image}
                    alt={service.title}
                    className="w-full aspect-[3/4] object-cover group-hover:scale-[1.1] transition-transform duration-700"
                    loading="lazy"
                    decoding="async" />

                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-700 z-20" />
                        </div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">{service.title}</h4>
                        <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
                      </div>
                    </motion.div>
            )}
                </div>
              </div>
            </section>

            {/* About Us Section */}
            <section className="py-16 md:py-24 bg-white">
              <div className="max-w-7xl mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-20 items-stretch">
                  {/* Text Content */}
                  <motion.div {...fadeIn} className="space-y-12">
                    <div className="space-y-6">
                      <h2 className="text-sm uppercase tracking-widest text-red-600 font-bold">About Us</h2>
                      <h3 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                        Working hand-in-hand with your goals, budget, timeline, and lifestyle, we build the enviable space you'll love calling home.
                      </h3>
                    </div>

                    <div className="space-y-6 border-t border-gray-100 pt-8">
                      <h4 className="text-2xl font-bold text-gray-900">Commitment to Perfection</h4>
                      <div className="space-y-4 text-gray-600 leading-relaxed text-lg">
                        <p>
                          We don't just strive for excellence… we pursue perfection on every project, every time. Our passion shines through in every detail—from our friendly smiles to our meticulous attention to detail. Our contractors are fully licensed and insured, so you're always protected. Our dedication to you, the customer, means we prioritize open, honest communication throughout the collaborative process.
                        </p>
                      </div>
                      <Button asChild variant="link" className="text-gray-900 hover:text-red-600 p-0 h-auto font-semibold text-lg group">
                        <Link to={createPageUrl('About')} className="flex items-center gap-2">
                          Learn More <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </Link>
                      </Button>
                    </div>
                  </motion.div>

                  {/* Image */}
                  <motion.div {...fadeIn} className="relative mt-8 lg:mt-0 h-full">
                    <img
                src="https://static.wixstatic.com/media/c1b522_38c04d6b49cb48ab8c1755d93f712bb4~mv2.jpeg/v1/fill/w_635,h_496,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Dancoby_Penthouse%20Finished_Shot%2013.jpeg"
                alt="Modern Kitchen"
                className="w-full h-full object-cover shadow-2xl rounded-sm"
                loading="lazy"
                decoding="async" />

                  </motion.div>
                </div>
              </div>
            </section>

      {/* Testimonials Section */}
      <div id="reviews">
        <TestimonialsSection />
      </div>

      {/* Awards Banner */}
      <section ref={awardsRef} className="py-16 md:py-24 bg-stone-900 relative overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-stone-800 to-stone-900"
          style={{ y: awardsY }} />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div {...fadeIn} className="text-center">
            <h3 className="text-4xl md:text-5xl font-bold text-stone-50">
              3-Year Warranty on All Projects
            </h3>
          </motion.div>
        </div>
      </section>

      {/* Featured Projects Grid */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
            { id: "697c5e88074fc8d96b14a823", title: "Custom banquette seating with warm oak slat wall and integrated planter details", logo: "Custom Millwork", image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697c18d2dbda3b3101bfe937/3ffe813be_VAN_SARKI_STUDIO_8_PARK_SLOPE_22691.jpg" },
            { id: "697cede5ec09b851f1e8fe80", title: "Spa-inspired shower with handmade zellige tile and brass fixtures", logo: "Seamless Custom Tile Design", image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697c18d2dbda3b3101bfe937/7606e7773_Dancoby_PenthouseFinished_Shot20-V2.jpg" },
            { id: "697d0e3c6291ff1c55121181", title: "Modern hotel spa inspired suite with marble flooring and walnut accent paneling", logo: "Hotel Inspired Suite", image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697c18d2dbda3b3101bfe937/484896910_Dancoby_849Central_15.jpg" },
            { id: "697cede5ec09b851f1e8fe80", title: "Elegant Kitchen Renovation with Custom Cabinetry", logo: "Kitchen Remodel", image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697c18d2dbda3b3101bfe937/ee675d31e_Dancoby_PenthouseFinished_Shot16.jpg" }].
            map((project, idx) =>
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group flex flex-col h-full">

                    <Link to={`${createPageUrl('ProjectDetail')}?id=${project.id}`} className="block relative overflow-hidden mb-6 bg-gray-200">
                      <img
                  src={project.image}
                  alt={project.logo}
                  className="w-full h-96 object-cover group-hover:scale-[1.1] transition-transform duration-700"
                  loading="lazy"
                  decoding="async" />

                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-700 z-20" />
                    </Link>

                    <div className="flex flex-col flex-1">
                      <div className="h-12 flex items-center">
                        <div className="text-xs font-bold uppercase tracking-wider text-gray-400">
                          {project.logo}
                        </div>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 leading-tight mb-4">
                        <Link to={`${createPageUrl('ProjectDetail')}?id=${project.id}`} className="hover:text-red-600 transition-colors">
                          {project.title}
                        </Link>
                      </h3>
                      <div className="mt-auto">
                        <Button asChild className="bg-red-600 hover:bg-red-700 text-white h-auto py-2 px-4 text-sm">
                          <Link to={`${createPageUrl('ProjectDetail')}?id=${project.id}`}>
                            View Project
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </motion.div>
            )}
              </div>

              <div className="text-center mt-16">
                <Button asChild className="bg-gray-900 hover:bg-gray-800 text-white text-sm tracking-wide px-6 h-10">
                  <Link to={createPageUrl('Projects')}>View All Projects</Link>
                </Button>
              </div>
        </div>
      </section>

      {/* Powered by JobTread Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeIn} className="text-center mb-16">
            <p className="text-xs tracking-[2px] text-[#a39e96] uppercase mb-4">Technology Partners</p>
            <motion.h2
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-5xl font-light text-gray-900 mb-6">

                    Powered by JobTread
                  </motion.h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              We use industry-leading construction management software to deliver better results, 
              keep projects on time and on budget, and provide you with complete transparency throughout your renovation.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
            <motion.div {...fadeIn}>
              <motion.div
                className="bg-gradient-to-br from-[#f8f7f6] to-[#f0efed] rounded-2xl p-8 shadow-lg relative"
                animate={{
                  boxShadow: [
                  "0 10px 40px -10px rgba(107, 102, 94, 0.2)",
                  "0 20px 60px -10px rgba(107, 102, 94, 0.35)",
                  "0 10px 40px -10px rgba(107, 102, 94, 0.2)"]

                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}>

                <motion.div
                  className="absolute inset-0 rounded-2xl opacity-0"
                  style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(107,102,94,0.05) 100%)" }}
                  animate={{
                    opacity: [0, 0.5, 0]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }} />

                <motion.img
                  src="https://www.jobtread.com/images/videos/jobtread-in-five-minutes.webp"
                  alt="JobTread Dashboard"
                  className="w-full rounded-lg shadow-md relative z-10"
                  animate={{
                    scale: [1, 1.01, 1]
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }} />

              </motion.div>
            </motion.div>

            <motion.div {...fadeIn} className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">How It Benefits You</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  JobTread empowers us with powerful construction estimating and project management tools, 
                  which means a smoother, more transparent experience for you.
                </p>
              </div>

              <div className="space-y-4">
                {[
                { title: "Real-Time Updates", desc: "Track your project's progress anytime, anywhere through your personal customer portal" },
                { title: "Financial Transparency", desc: "View proposals, invoices, and make payments securely online" },
                { title: "Centralized Communication", desc: "All project documents, photos, and messages in one convenient place" },
                { title: "On-Time Delivery", desc: "Advanced scheduling and budgeting keeps your project on track" }].
                map((item, idx) =>
                <div key={idx} className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#6b665e] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{item.title}</h4>
                      <p className="text-gray-600 text-sm">{item.desc}</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          <motion.div {...fadeIn} className="grid md:grid-cols-3 gap-8">
            {[
            {
              icon:
              <svg className="w-8 h-8 text-[#6b665e]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                  </svg>,

              title: "Accurate Estimates",
              desc: "Professional proposals with detailed cost breakdowns, eliminating surprises"
            },
            {
              icon:
              <svg className="w-8 h-8 text-[#6b665e]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>,

              title: "Smart Scheduling",
              desc: "Coordinated timelines ensure efficient workflow and minimal disruption"
            },
            {
              icon:
              <svg className="w-8 h-8 text-[#6b665e]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                  </svg>,

              title: "Budget Control",
              desc: "Real-time cost tracking keeps your project within budget"
            }].
            map((item, idx) =>
            <div key={idx} className="bg-[#fafaf9] rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                  {item.icon}
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            )}
          </motion.div>

        </div>
      </section>

      {/* What We're Up To Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16">
            <p className="text-xs tracking-[2px] text-[#a39e96] uppercase mb-4">Current Projects</p>
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">What We're Up To</h2>
            <p className="text-lg text-[#78716b] max-w-2xl font-light">A glimpse into our active construction sites where craftsmanship meets innovation.</p>
          </div>
          {isLoadingProjects ? <CurrentProjectsSkeleton /> : homeProjects.length > 0 ?
          <div className="grid md:grid-cols-2 gap-12 mb-16">
              {homeProjects.map((project, idx) => {
              const status = parseInt(project.status);
              const getColor = () => {
                if (status >= 80) return "text-green-600";
                if (status >= 40) return "text-yellow-500";
                return "text-red-600";
              };
              const getBgColor = () => {
                if (status >= 80) return "bg-green-600";
                if (status >= 40) return "bg-yellow-500";
                return "bg-red-600";
              };

              return (
                <CurrentProjectCard
                  key={idx}
                  project={project}
                  idx={idx}
                  status={status}
                  getColor={getColor}
                  getBgColor={getBgColor}
                  fadeIn={fadeIn} />);


            })}
            </div> :

          <p className="text-center text-gray-500 mb-16">No active projects to display right now.</p>
          }

          {!isLoadingProjects && homeProjects.length > 0 &&
          <div className="flex justify-center">
              <Button asChild className="bg-gray-900 hover:bg-gray-800 text-white text-sm tracking-wide px-6 h-10">
                  <Link to={createPageUrl('ActiveProjects')}>See More</Link>
              </Button>
            </div>
          }
        </div>
      </section>

      <section className="bg-[#1c1917] text-white text-center py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs tracking-[2px] text-[#78716b] uppercase mb-4">Interested in working with us?</p>
          <h2 className="text-3xl md:text-4xl font-light mb-8">Let's Build Something Beautiful</h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
            <Button asChild className="bg-white text-[#1c1917] hover:bg-gray-200 px-8 py-6 text-sm tracking-wider uppercase min-w-[200px]">
              <Link to={createPageUrl('Contact')}>Get In Touch</Link>
            </Button>
            <Button asChild className="bg-white text-[#1c1917] hover:bg-gray-200 px-8 py-6 text-sm tracking-wider uppercase min-w-[200px]">
              <Link to={createPageUrl('VendorIntake')}>
                Subcontractor Registration
              </Link>
            </Button>
            <VibrantExternalLink
              href="https://dancobyconstruction.discovered.ai/"
              className="min-w-[200px]">

              View Open Positions
            </VibrantExternalLink>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="py-20 md:py-32 bg-gray-900 text-white relative overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-gray-800 to-gray-900"
          style={{ y: ctaY }} />

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div {...fadeIn}>
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              Transform Your Space Into Something Extraordinary
            </h2>
            <p className="text-xl text-gray-300 mb-12">
              Let's create your perfect home with sophisticated design and expert craftsmanship
            </p>
            <EstimatorButton size="large" />
          </motion.div>
        </div>
      </section>
    </main>);

}