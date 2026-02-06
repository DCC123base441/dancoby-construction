import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import SEOHead from '../components/SEOHead';
import TestimonialsSection from '../components/TestimonialsSection';

export default function Home() {
  const { data: projects = [] } = useQuery({
    queryKey: ['featured-projects'],
    queryFn: () => base44.entities.Project.filter({ featured: true }, '-order', 4),
    initialData: [],
  });

  const { data: currentProjects = [] } = useQuery({
    queryKey: ['current-projects'],
    queryFn: () => base44.entities.CurrentProject.filter({ featuredOnHome: true }, 'order', 3),
    initialData: [],
  });

  const services = [
    {
      title: 'Kitchen & Bath',
      description: 'Transform the heart of your home with timeless design and superior craftsmanship.',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
      path: 'ServiceKitchenBath'
    },
    {
      title: 'Brownstone Restoration',
      description: 'Preserve history while creating modern comfort in your classic Brooklyn home.',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
      path: 'ServiceBrownstone'
    },
    {
      title: 'Full Renovations',
      description: 'Complete transformations that reimagine your space from foundation to finish.',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
      path: 'ServiceInteriorRenovations'
    },
  ];

  return (
    <main className="bg-[#faf9f7]">
      <SEOHead 
        title="Dancoby Construction | NYC Home Renovation Experts"
        description="Premier home renovation in NYC. Kitchen & bath remodeling, brownstone restoration, full renovations. 20+ years experience with 3-year warranty."
      />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center">
        <div className="absolute inset-0">
          <img 
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697c18d2dbda3b3101bfe937/99a553c33_Dancoby_PenthouseFinished_Shot9.jpg"
            alt="Luxury renovation"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#faf9f7] via-[#faf9f7]/80 to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-32 lg:py-0">
          <div className="max-w-2xl">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-xs tracking-[0.3em] uppercase text-[#8b7355] mb-6"
            >
              New York's Premier Renovation Firm
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl lg:text-7xl font-light leading-[1.1] text-[#2d2d2d] mb-8"
            >
              Crafting Spaces<br />
              <span className="italic">Worth Living In</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-[#2d2d2d]/70 leading-relaxed mb-10 max-w-lg"
            >
              Over twenty years of transforming New York homes with thoughtful design, 
              exceptional craftsmanship, and an unwavering commitment to your vision.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                to={createPageUrl('Contact')}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#2d2d2d] text-white text-sm tracking-[0.15em] uppercase hover:bg-[#8b7355] transition-colors duration-300"
              >
                Start Your Project
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to={createPageUrl('Projects')}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 border border-[#2d2d2d] text-[#2d2d2d] text-sm tracking-[0.15em] uppercase hover:bg-[#2d2d2d] hover:text-white transition-colors duration-300"
              >
                View Our Work
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 hidden lg:block"
        >
          <div className="w-px h-16 bg-[#2d2d2d]/20 relative overflow-hidden">
            <motion.div 
              animate={{ y: ['-100%', '100%'] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute inset-x-0 h-1/2 bg-[#8b7355]"
            />
          </div>
        </motion.div>
      </section>

      {/* Intro Statement */}
      <section className="py-24 lg:py-32">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl lg:text-4xl font-light leading-relaxed text-[#2d2d2d]"
          >
            We are builders and creative thinkers who collaborate with clients, architects, 
            and makers who share our passion for <span className="italic">thoughtful renovations</span>.
          </motion.h2>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-16">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-[#8b7355] mb-4">Our Expertise</p>
              <h2 className="text-4xl lg:text-5xl font-light text-[#2d2d2d]">What We Do</h2>
            </div>
            <Link 
              to={createPageUrl('Services')}
              className="text-sm tracking-[0.15em] uppercase text-[#2d2d2d] hover:text-[#8b7355] transition-colors flex items-center gap-2"
            >
              All Services <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link to={createPageUrl(service.path)} className="group block">
                  <div className="aspect-[4/5] overflow-hidden mb-6">
                    <img 
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="text-xl font-light text-[#2d2d2d] mb-3 group-hover:text-[#8b7355] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm text-[#2d2d2d]/60 leading-relaxed">
                    {service.description}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-16">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-[#8b7355] mb-4">Portfolio</p>
              <h2 className="text-4xl lg:text-5xl font-light text-[#2d2d2d]">Recent Projects</h2>
            </div>
            <Link 
              to={createPageUrl('Projects')}
              className="text-sm tracking-[0.15em] uppercase text-[#2d2d2d] hover:text-[#8b7355] transition-colors flex items-center gap-2"
            >
              View All <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {(projects.length > 0 ? projects : [
              { id: 1, title: 'Park Slope Brownstone', category: 'Restoration', mainImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80' },
              { id: 2, title: 'Brooklyn Heights Kitchen', category: 'Kitchen & Bath', mainImage: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80' },
              { id: 3, title: 'Tribeca Loft', category: 'Full Renovation', mainImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80' },
              { id: 4, title: 'Upper West Side Classic', category: 'Residential', mainImage: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800&q=80' },
            ]).slice(0, 4).map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link 
                  to={`${createPageUrl('ProjectDetail')}?id=${project.id}`}
                  className="group block"
                >
                  <div className={`overflow-hidden mb-6 ${i === 0 || i === 3 ? 'aspect-[4/3]' : 'aspect-square'}`}>
                    <img 
                      src={project.mainImage}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <p className="text-xs tracking-[0.2em] uppercase text-[#8b7355] mb-2">{project.category}</p>
                  <h3 className="text-xl font-light text-[#2d2d2d] group-hover:text-[#8b7355] transition-colors">
                    {project.title}
                  </h3>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Current Projects Teaser */}
      {currentProjects.length > 0 && (
        <section className="py-16 lg:py-24 bg-[#2d2d2d] text-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-12">
              <div>
                <p className="text-xs tracking-[0.3em] uppercase text-[#c4bdb4] mb-4">In Progress</p>
                <h2 className="text-4xl lg:text-5xl font-light">Active Projects</h2>
              </div>
              <Link 
                to={createPageUrl('ActiveProjects')}
                className="text-sm tracking-[0.15em] uppercase text-white/70 hover:text-white transition-colors flex items-center gap-2"
              >
                See All <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {currentProjects.map((project) => (
                <div key={project.id} className="group">
                  <div className="aspect-[4/3] overflow-hidden mb-4">
                    <img 
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#8b7355] transition-all duration-500"
                        style={{ width: `${project.status}%` }}
                      />
                    </div>
                    <span className="text-sm text-white/60">{project.status}%</span>
                  </div>
                  <h3 className="text-lg font-light mb-1">{project.title}</h3>
                  <p className="text-sm text-white/50">{project.location}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Process */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.3em] uppercase text-[#8b7355] mb-4">How It Works</p>
            <h2 className="text-4xl lg:text-5xl font-light text-[#2d2d2d]">Our Process</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { num: '01', title: 'Consultation', desc: 'Share your vision and we\'ll explore possibilities together.' },
              { num: '02', title: 'Design', desc: 'Collaborate on every detail from materials to finishes.' },
              { num: '03', title: 'Build', desc: 'Our expert team brings your vision to life with precision.' },
              { num: '04', title: 'Reveal', desc: 'Walk into your transformed space, backed by our 3-year warranty.' },
            ].map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <span className="text-5xl font-light text-[#e8e4df] block mb-4">{step.num}</span>
                <h3 className="text-lg font-light text-[#2d2d2d] mb-3">{step.title}</h3>
                <p className="text-sm text-[#2d2d2d]/60 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 lg:py-32">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-xs tracking-[0.3em] uppercase text-[#8b7355] mb-6">Ready to Begin?</p>
            <h2 className="text-4xl lg:text-5xl font-light text-[#2d2d2d] mb-8 leading-tight">
              Let's Create Something<br /><span className="italic">Beautiful Together</span>
            </h2>
            <Link
              to={createPageUrl('Contact')}
              className="inline-flex items-center gap-3 px-10 py-5 bg-[#2d2d2d] text-white text-sm tracking-[0.15em] uppercase hover:bg-[#8b7355] transition-colors duration-300"
            >
              Start Your Project
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}