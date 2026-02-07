import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import ProjectCard from '../components/ProjectCard';
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
        keywords="renovation portfolio Brooklyn, kitchen remodel examples, bathroom renovation photos, brownstone restoration projects, NYC construction portfolio"
      />
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="relative h-[40vh] md:h-[60vh] flex items-center justify-center overflow-hidden"
      >
        <motion.div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://static.wixstatic.com/media/c1b522_b13b1f361627437baf0908a2f28923ee~mv2.jpeg/v1/fill/w_1920,h_1080,fp_0.52_0.77,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/c1b522_b13b1f361627437baf0908a2f28923ee~mv2.jpeg)',
            y: heroY,
            scale: heroScale
          }}
        />
        <div className="absolute inset-0 bg-black/40" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center text-white"
        >
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">Projects</h1>
        </motion.div>
      </section>

      {/* Projects Grid */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <ProjectCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="flex items-center justify-center py-16">
              <p className="text-gray-500">No projects found in this category.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </section>



      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-8 tracking-wide">
              Start Your Own Project
            </h2>
            <p className="text-xl text-gray-600 mb-12 font-light">
              Let's create something amazing together
            </p>
            <EstimatorButton size="large" />
          </motion.div>
        </div>
      </section>
    </main>
  );
}