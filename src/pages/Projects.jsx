import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import ProjectCard from '../components/ProjectCard';
import ProjectFilters from '../components/ProjectFilters';
import { ProjectCardSkeleton } from '../components/SkeletonLoader';

import EstimatorButton from '../components/EstimatorButton';
import SEOHead from '../components/SEOHead';

export default function Projects() {
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('curated');
  
  const heroRef = useRef(null);
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const heroY = useTransform(heroScrollProgress, [0, 1], ["0%", "30%"]);
  const heroScale = useTransform(heroScrollProgress, [0, 1], [1, 1.1]);

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => base44.entities.Project.list(),
    initialData: []
  });

  const filteredProjects = projects
    .filter(p => category === 'all' || p.category === category)
    .sort((a, b) => {
      if (sort === 'curated') {
        // Use the 'order' field for sorting, falling back to 0 if not set
        // If orders are equal, fallback to created_date
        const orderA = a.order !== undefined ? a.order : 999;
        const orderB = b.order !== undefined ? b.order : 999;
        if (orderA !== orderB) return orderA - orderB;
        return new Date(b.created_date) - new Date(a.created_date);
      }
      switch(sort) {
        case 'oldest':
          return new Date(a.created_date) - new Date(b.created_date);
        case 'name-asc':
          return a.title.localeCompare(b.title);
        case 'name-desc':
          return b.title.localeCompare(a.title);
        case 'recent':
        default:
          return new Date(b.created_date) - new Date(a.created_date);
      }
    });

  return (
    <main className="min-h-screen bg-white">
      <SEOHead 
        title="Our Projects | Kitchen, Bath & Home Renovation Portfolio"
        description="Browse our portfolio of completed renovation projects in NYC & Long Island. Kitchen remodels, bathroom renovations, brownstone restorations. See our craftsmanship."
        keywords="renovation portfolio Brooklyn, kitchen remodel examples Long Island, bathroom renovation photos, brownstone restoration projects Park Slope, construction portfolio Brooklyn, before and after renovation, home renovation gallery, completed projects Long Island, renovation inspiration, custom home renovation examples Nassau County, Five Towns renovation projects"
      />
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="relative h-[75vh] flex items-center overflow-hidden"
      >
        <motion.div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://static.wixstatic.com/media/c1b522_b13b1f361627437baf0908a2f28923ee~mv2.jpeg/v1/fill/w_1920,h_1080,fp_0.52_0.77,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/c1b522_b13b1f361627437baf0908a2f28923ee~mv2.jpeg)',
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
                Our Portfolio
              </motion.p>
              <motion.h1 
                className="text-3xl md:text-5xl lg:text-6xl font-extralight tracking-wide text-white leading-[1.15] mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                Crafted with<br /><em className="italic font-light text-white/90">Precision & Care</em>
              </motion.h1>
              <motion.p 
                className="text-white/60 text-base md:text-lg leading-relaxed max-w-xl font-light"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
              >
                Browse our portfolio of completed renovations across New York City and Long Island.
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16 md:py-28 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <ProjectFilters 
            onFilterChange={setCategory} 
            onSortChange={setSort} 
          />

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-14">
              {[...Array(6)].map((_, i) => (
                <ProjectCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <p className="text-stone-400 text-sm tracking-wide">No projects found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-14">
              {filteredProjects.map((project, i) => (
                <ProjectCard key={project.id} project={project} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-stone-50">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <p className="text-[11px] uppercase tracking-[0.3em] text-stone-400 font-medium">Ready to Begin?</p>
            <h2 className="text-3xl md:text-4xl font-light text-stone-900 tracking-wide">
              Let's create something<br /><em className="italic">remarkable</em> together
            </h2>
            <div className="pt-4">
              <EstimatorButton size="large" />
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}