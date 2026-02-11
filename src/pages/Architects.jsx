import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { CheckCircle, Phone, Mail, ArrowRight } from 'lucide-react';
import SEOHead from '../components/SEOHead';


export default function Architects() {
  const heroRef = useRef(null);
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const heroY = useTransform(heroScrollProgress, [0, 1], ["0%", "30%"]);

  const fadeIn = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  const benefits = [
    { title: "Pre-Construction Collaboration", desc: "We partner with you early in the design phase, providing pricing input and feasibility insights as the design progresses." },
    { title: "Permitting Liaison", desc: "We handle the NYC permitting process on your behalf, freeing up your time and resources to focus on design." },
    { title: "Accurate Cost Estimating", desc: "Our detailed estimating process ensures your clients have realistic budgets from day one — no surprises." },
    { title: "Seamless Communication", desc: "Through our JobTread project management platform, all documents, updates, and communications are centralized and transparent." },
    { title: "Quality Execution", desc: "Over 20 years of experience delivering high-end residential renovations in Brooklyn and across NYC with a 3-year warranty." },
    { title: "Personality Compatibility", desc: "We match our team to your project style and client expectations — we're an extension of your practice." },
  ];

  return (
    <main className="min-h-screen bg-white">
      <SEOHead
        title="For Architects & Designers | Dancoby Construction"
        description="Partner with Dancoby Construction for your next NYC renovation project. Pre-construction collaboration, permitting, and expert execution for architects and designers."
        keywords="architect partner NYC, construction partner for architects, builder for architects Brooklyn, designer collaboration, NYC renovation contractor"
      />

      {/* Hero Section */}
      <section ref={heroRef} className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={{ y: heroY }}
        >
          <img
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697c18d2dbda3b3101bfe937/99a553c33_Dancoby_PenthouseFinished_Shot9.jpg"
            alt="Dancoby Construction Interior"
            className="w-full h-[120%] object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-6 w-full">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="max-w-2xl"
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
                A Note to Architects & Designers
              </motion.p>
              <motion.h1
                className="text-3xl md:text-5xl lg:text-6xl font-extralight tracking-wide text-white leading-[1.15] mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                Let's Build Your<br /><em className="italic font-light text-white/90">Vision Together</em>
              </motion.h1>
              <motion.p
                className="text-white/60 text-lg font-light max-w-lg"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
              >
                We partner with architects and designers to bring exceptional projects to life — on time, on budget, and with uncompromising quality.
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div {...fadeIn} className="space-y-8">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-red-600 mb-3">Partner With Us</h2>
                <h3 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                  We've been fortunate to work with many talented architects and designers.
                </h3>
              </div>
              <div className="space-y-5 text-gray-600 text-lg leading-relaxed">
                <p>
                  More than ever, our clients are choosing their builders first and looking to us to recommend designers and architects. We make our recommendations based on project scope, style, budget, and even personality compatibility.
                </p>
                <p>
                  We would love to get to know you and your services, so that we may broaden our network for our clients.
                </p>
                <p>
                  If you are an architect designing a home in NYC, we understand you might not be based here. We've worked with many architects throughout the US, and know that most have a select group of builders they trust. We would love the opportunity to introduce ourselves, should we be of service for your future projects.
                </p>
              </div>
            </motion.div>

            <motion.div {...fadeIn}>
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697c18d2dbda3b3101bfe937/01286028a_Dancoby_PenthouseFinished_Shot15.jpg"
                alt="Dancoby finished project"
                className="w-full h-[500px] object-cover shadow-2xl rounded-sm"
                loading="lazy"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-16 md:py-20 bg-stone-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div {...fadeIn}>
            <blockquote className="text-2xl md:text-3xl font-light italic leading-relaxed mb-6 text-stone-200">
              "Architecture is a visual art and the buildings speak for themselves. But the best buildings are born from a conversation between architect and builder."
            </blockquote>
            <p className="text-stone-400 text-sm uppercase tracking-widest">— Julia Morgan</p>
          </motion.div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeIn} className="text-center mb-16">
            <h2 className="text-sm uppercase tracking-widest text-gray-500 mb-4">Why Partner With Dancoby</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900">How We Add Value to Your Projects</h3>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center mb-5">
                  <CheckCircle className="w-5 h-5 text-red-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">{benefit.title}</h4>
                <p className="text-gray-600 leading-relaxed">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Commitment Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div {...fadeIn}>
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697c18d2dbda3b3101bfe937/484896910_Dancoby_849Central_15.jpg"
                alt="Dancoby project detail"
                className="w-full h-[450px] object-cover shadow-2xl rounded-sm"
                loading="lazy"
              />
            </motion.div>

            <motion.div {...fadeIn} className="space-y-8">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-red-600 mb-3">Our Commitment</h2>
                <h3 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                  We work tirelessly to execute on your behalf.
                </h3>
              </div>
              <div className="space-y-5 text-gray-600 text-lg leading-relaxed">
                <p>
                  We are an extremely amicable team and have a lot of fun tackling the challenges that arise throughout the construction process. We find great satisfaction learning and meeting your expectations for quality.
                </p>
                <p>
                  We are committed to integrating our team with yours as we bring your projects to life. We understand that teamwork is the fuel that allows common people to attain uncommon results.
                </p>
                <p className="font-medium text-gray-900">
                  We look forward to working with you.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How We Work Together Section */}
      <section className="py-16 md:py-24 bg-[#f8f7f6]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeIn} className="text-center mb-16">
            <h2 className="text-sm uppercase tracking-widest text-gray-400 mb-4">Our Process</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900">How We Work With You</h3>
          </motion.div>

          <div className="space-y-0">
            {[
              {
                step: "01",
                title: "Introduction & Alignment",
                desc: "We start by understanding your design philosophy, project scope, and client expectations. This initial conversation ensures we're the right fit before any work begins.",
                image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697c18d2dbda3b3101bfe937/3ffe813be_VAN_SARKI_STUDIO_8_PARK_SLOPE_22691.jpg",
              },
              {
                step: "02",
                title: "Pre-Construction & Estimating",
                desc: "As your design evolves, we provide real-time pricing input and constructability feedback — catching potential issues early and keeping budgets honest.",
                image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697c18d2dbda3b3101bfe937/7606e7773_Dancoby_PenthouseFinished_Shot20-V2.jpg",
              },
              {
                step: "03",
                title: "Permitting & Approvals",
                desc: "We handle NYC's complex permitting landscape so you don't have to. From DOB filings to landmark approvals, we act as your dedicated liaison.",
                image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697c18d2dbda3b3101bfe937/484896910_Dancoby_849Central_15.jpg",
              },
              {
                step: "04",
                title: "Execution & Delivery",
                desc: "Our skilled crews bring your designs to life with precision and care. You'll have full visibility through our project management platform every step of the way.",
                image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697c18d2dbda3b3101bfe937/ee675d31e_Dancoby_PenthouseFinished_Shot16.jpg",
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.05 }}
                className={`grid lg:grid-cols-2 gap-0 ${idx % 2 === 1 ? 'lg:direction-rtl' : ''}`}
              >
                <div className={`${idx % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-72 lg:h-80 object-cover"
                    loading="lazy"
                  />
                </div>
                <div className={`flex items-center p-8 lg:p-12 bg-white ${idx % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <div>
                    <span className="text-5xl font-extralight text-red-600/20 block mb-2">{item.step}</span>
                    <h4 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h4>
                    <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div {...fadeIn}>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Collaborate?
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Whether you have a project in mind or just want to explore a partnership, we'd love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild className="bg-white text-gray-900 hover:bg-gray-200 px-8 py-6 text-sm tracking-wider uppercase min-w-[200px]">
                <Link to={createPageUrl('Contact')}>
                  Get In Touch <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <a href="tel:+15166849766" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-sm">
                <Phone className="w-4 h-4" /> (516) 684-9766
              </a>
              <a href="mailto:info@dancoby.com" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-sm">
                <Mail className="w-4 h-4" /> info@dancoby.com
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}