import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Target, Heart, Shield, Award } from 'lucide-react';
import EstimatorButton from '../components/EstimatorButton';
import SEOHead from '../components/SEOHead';

export default function About() {
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

  return (
    <main className="min-h-screen bg-white">
      <SEOHead 
        title="About Us | 20+ Years of NYC Home Renovation Excellence"
        description="Learn about Dancoby Construction's 20+ years of NYC renovation experience. Licensed, insured contractors with 5-year warranty. Meet our founder and team."
        keywords="about Dancoby Construction, NYC renovation company, licensed contractor Brooklyn, home renovation experience, general contractor history"
      />
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="relative h-[75vh] flex items-center overflow-hidden"
      >
        <motion.div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://static.wixstatic.com/media/c1b522_51ff5023986c46a88a21cb6a2bae4e3c~mv2.jpeg/v1/fill/w_1920,h_1080,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/c1b522_51ff5023986c46a88a21cb6a2bae4e3c~mv2.jpeg)',
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
                About Dancoby Construction
              </motion.p>
              <motion.h1 
                className="text-3xl md:text-5xl lg:text-6xl font-extralight tracking-wide text-white leading-[1.15] mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                More Than<br /><em className="italic font-light text-white/90">Just Remodelers</em>
              </motion.h1>
              <motion.p 
                className="text-white/60 text-base md:text-lg leading-relaxed max-w-xl font-light"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
              >
                Over twenty years of experience serving clients across New York City with elegant, functional, and completely stress-free renovations.
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tagline Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <p className="text-xs tracking-[2px] text-[#a39e96] uppercase mb-6">Our Philosophy</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 leading-[1.3]">
              We are builders and creative thinkers who love collaborating with clients, architects, and makers who share our passion for thoughtful renovations.
            </h2>
          </motion.div>
        </div>
      </section>

      {/* Three Pillars Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {[
              {
                icon: <Target className="w-5 h-5 text-red-600" />,
                title: "Our Mission",
                paragraphs: [
                  "We know how stressful a renovation project can be, but we do everything possible to make sure it is as smooth and painless as possible.",
                  "That means we take pride in our efficiency and leave every home looking better than when we arrived"
                ]
              },
              {
                icon: <Shield className="w-5 h-5 text-red-600" />,
                title: "Our Commitment",
                paragraphs: [
                  "Our commitment to customer and employee safety is paramount.",
                  "We understand that renovations can be invasive and dangerous, so our team always makes sure that you, your family, and your floors, furniture, and personal belongings are safe and protected before any work begins."
                ]
              },
              {
                icon: <Award className="w-5 h-5 text-red-600" />,
                title: "Our Standards",
                paragraphs: [
                  "Dancoby Construction exhibits the highest standards in the industry and leverages a customer-first approach so that we stay on your side from the first call to the final inspection.",
                  "In fact, we will be on your side for the long haul and even include a 3-year warranty on your project, no matter how big or small."
                ]
              }
            ].map((pillar, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white rounded-sm p-8 md:p-10 border border-gray-100"
              >
                <div className="w-12 h-12 bg-stone-50 rounded-lg flex items-center justify-center mb-6">
                  {pillar.icon}
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">{pillar.title}</h3>
                <div className="space-y-4">
                  {pillar.paragraphs.map((p, i) => (
                    <p key={i} className="text-gray-600 leading-relaxed">{p}</p>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Full story section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-6"
          >
            <p className="text-xs tracking-[2px] text-[#a39e96] uppercase">Our Story</p>
            <p className="text-xl md:text-2xl font-light text-gray-700 leading-relaxed">
              With over twenty years of experience serving clients across New York City, Dancoby truly understands the city's high standards, expectations, and common challenges in the industry. We go the extra mile—always with a smile—to stand out as a leader, delivering results that exceed what others offer.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Commitment to Perfection */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-stretch">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col justify-center space-y-8"
            >
              <div>
                <h2 className="text-sm uppercase tracking-widest text-red-600 font-bold mb-3">Our Promise</h2>
                <h3 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">Commitment to Perfection</h3>
              </div>
              <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
                <p>
                  We don't merely strive for excellence, we strive for perfection on every project, every time. Our passion resonates in everything we do from our friendly smile to our attention to detail, collaborative approach, and commitment to a flawless result.
                </p>
                <p>
                  Plus, our contractors are licensed and insured so you are always protected. Our dedication to you, the customer, means we encourage open, honest communication throughout the collaborative process from concept to completion.
                </p>
              </div>
              <div>
                <Button 
                  asChild
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-sm tracking-wider uppercase"
                >
                  <Link to={createPageUrl('Contact')}>Get In Touch</Link>
                </Button>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="h-full"
            >
              <img 
                src="https://static.wixstatic.com/media/c1b522_4f61cdea0afd4a25baa42f7f902c624e~mv2.jpeg/v1/fill/w_1920,h_629,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/c1b522_4f61cdea0afd4a25baa42f7f902c624e~mv2.jpeg"
                alt="Modern bathroom"
                className="w-full h-full min-h-[400px] object-cover shadow-2xl rounded-sm"
                loading="lazy"
                decoding="async"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Complete Satisfaction Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-stretch">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="h-full order-2 lg:order-1"
            >
              <img 
                src="https://static.wixstatic.com/media/c1b522_7231b6f8cbaf46cf8dd85c643a4230f7~mv2.jpg/v1/fill/w_467,h_418,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/VAN_SARKI_STUDIO_8_PARK_SLOPE_2311%201.jpg"
                alt="Bright kitchen window"
                className="w-full h-full min-h-[400px] object-cover shadow-2xl rounded-sm"
                loading="lazy"
                decoding="async"
              />
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="flex flex-col justify-center space-y-8 order-1 lg:order-2"
            >
              <div>
                <h2 className="text-sm uppercase tracking-widest text-red-600 font-bold mb-3">Your Guarantee</h2>
                <h3 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">Complete Satisfaction, Guaranteed</h3>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed">
                Our dedication to you means we prioritize open, honest communication every step of the way—from initial concept through final completion. We understand how challenging it can be to trust a team with your home—your castle—and your budget. That's exactly why we back every project with a 3-year warranty, giving you complete peace of mind that the finished result will meet or exceed your expectations.
              </p>
              <div>
                <Button asChild variant="link" className="text-gray-900 hover:text-red-600 p-0 h-auto font-semibold text-lg group">
                  <Link to={createPageUrl('Contact')} className="flex items-center gap-2">
                    Contact Us <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About The Founder */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-stretch">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="h-full"
            >
              <img 
                src="https://static.wixstatic.com/media/efb67d_56ea9dfe4a0f437a8bc6abb241a18a24~mv2.jpeg/v1/fill/w_551,h_493,fp_0.54_0.31,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Favorite-Aragon-Headshot-94.jpeg"
                alt="Ralph - Founder"
                className="w-full h-full min-h-[500px] object-cover shadow-2xl rounded-sm"
                loading="lazy"
                decoding="async"
              />
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="flex flex-col justify-center space-y-8"
            >
              <div>
                <h2 className="text-sm uppercase tracking-widest text-red-600 font-bold mb-3">Leadership</h2>
                <h3 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">About The Founder</h3>
              </div>
              <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
                <p>
                  Ralph is a dedicated general contractor with over 20 years' experience. Alongside his team, Ralph coordinates trades, builds partnerships, and collaborates with architects, engineers, vendors, and homeowners to ensure efficient and budget-friendly completion of every project.
                </p>
                <p>
                  With a deep knowledge of building and code regulations, expertise in team building, and devotion to leadership and quality control management, Ralph remains an industry leader with a commitment to client satisfaction.
                </p>
                <p>
                  During his free time Ralph enjoys playing pickleball, biking, or relaxing by the beach with his Goldendoodle, Jaxx. He currently lives in Rockaway Beach NY and holds a general contractor license in New York and Nassau County.
                </p>
              </div>
              <div>
                <Button 
                  asChild
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-sm tracking-wider uppercase"
                >
                  <Link to={createPageUrl('Contact')}>Let's Talk</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="py-20 md:py-32 bg-gray-900 text-white relative overflow-hidden">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-t from-gray-800 to-gray-900"
          style={{ y: ctaY }}
        />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-8">Ready to Start Your Project?</h2>
            <p className="text-xl text-gray-300 mb-12">
              Let's work together to create the space of your dreams
            </p>
            <EstimatorButton size="large" />
          </motion.div>
        </div>
      </section>
    </main>
  );
}