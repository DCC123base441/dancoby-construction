import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import ProjectCard from '../components/ProjectCard';
import ProjectFilters from '../components/ProjectFilters';
import { ProjectCardSkeleton } from '../components/SkeletonLoader';
import EstimatorButton from '../components/EstimatorButton';
import SEOHead from '../components/SEOHead';
import { ArrowDown } from 'lucide-react';

export default function Projects() {
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('curated');
  
  const heroRef = useRef(null);
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const heroY = useTransform(heroScrollProgress, [0, 1], ["0%", "40%"]);
  const heroOpacity = useTransform(heroScrollProgress, [0, 0.8], [1, 0]);

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => base44.entities.Project.list(),
    initialData: []
  });

  const filteredProjects = projects
    .filter(p => category === 'all' || p.category === category)
    .sort((a, b) => {
      if (sort === 'curated') {
        const orderA = a.order !== undefined ? a.order : 999;
        const orderB = b.order !== undefined ? b.order : 999;
        if (orderA !== orderB) return orderA - orderB;
        return new Date(b.created_date) - new Date(a.created_date);
      }
      switch(sort) {
        case 'oldest': return new Date(a.created_date) - new Date(b.created_date);
        case 'name-asc': return a.title.localeCompare(b.title);
        case 'name-desc': return b.title.localeCompare(a.title);
        case 'recent':
        default: return new Date(b.created_date) - new Date(a.created_date);
      }
    });

  return (
    <main className="min-h-screen bg-white">
      <SEOHead 
        title="Our Projects | Kitchen, Bath & Home Renovation Portfolio"
        description="Browse our portfolio of completed renovation projects in NYC & Long Island. Kitchen remodels, bathroom renovations, brownstone restorations. See our craftsmanship."
        keywords="renovation portfolio Brooklyn, kitchen remodel examples Long Island, bathroom renovation photos, brownstone restoration projects Park Slope, construction portfolio Brooklyn"
      />

      {/* Hero */}
      <section ref={heroRef} className="relative h-[85vh] flex items-end overflow-hidden">
        <motion.div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://static.wixstatic.com/media/c1b522_b13b1f361627437baf0908a2f28923ee~mv2.jpeg/v1/fill/w_1920,h_1080,fp_0.52_0.77,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/c1b522_b13b1f361627437baf0908a2f28923ee~mv2.jpeg)',
            y: heroY,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        
        <motion.div 
          style={{ opacity: heroOpacity }}
          className="relative z-10 max-w-7xl mx-auto px-6 w-full pb-16 md:pb-24"
        >
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <p className="text-white/50 text-[11px] uppercase tracking-[0.4em] mb-4 font-light">
                Portfolio
              </p>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extralight text-white leading-[1.1] mb-6 tracking-tight">
                Our Finest<br />
                <span className="italic font-light text-white/80">Work</span>
              </h1>
              <div className="h-px w-20 bg-gradient-to-r from-red-500 to-transparent mb-6" />
              <p className="text-white/50 text-base md:text-lg max-w-lg font-light leading-relaxed">
                Every project tells a story of meticulous craftsmanship and thoughtful design across New York City and Long Island.
              </p>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div 
            className="absolute bottom-8 right-6 md:right-8 flex flex-col items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <span className="text-white/30 text-[10px] uppercase tracking-[0.3em] writing-mode-vertical hidden md:block"
              style={{ writingMode: 'vertical-rl' }}
            >
              Scroll
            </span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <ArrowDown className="w-4 h-4 text-white/30" />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Projects Grid */}
      <section className="py-16 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <ProjectFilters 
            onFilterChange={setCategory} 
            onSortChange={setSort} 
          />

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
              {[...Array(6)].map((_, i) => (
                <ProjectCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24">
              <p className="text-stone-400 text-sm tracking-wide">No projects found in this category.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
              {filteredProjects.map((project, idx) => (
                <ProjectCard key={project.id} project={project} index={idx} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32 bg-stone-950 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-white/40 text-[11px] uppercase tracking-[0.4em] mb-6">Ready to begin?</p>
            <h2 className="text-3xl md:text-5xl font-extralight tracking-tight mb-4 leading-tight">
              Let's Build Something<br />
              <span className="italic font-light text-white/70">Extraordinary</span>
            </h2>
            <div className="h-px w-16 bg-red-500/50 mx-auto my-8" />
            <p className="text-white/40 text-base mb-10 max-w-md mx-auto font-light">
              Start with a free consultation and see what's possible for your space.
            </p>
            <EstimatorButton size="large" />
          </motion.div>
        </div>
      </section>
    </main>
  );
}