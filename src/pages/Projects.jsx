import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import ProjectCard from '../components/ProjectCard';
import ProjectFilters from '../components/ProjectFilters';
import EstimatorButton from '../components/EstimatorButton';
import SEOHead from '../components/SEOHead';

export default function Projects() {
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('curated');

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => base44.entities.Project.list(),
    initialData: []
  });

  const filteredProjects = projects
    .filter(p => category === 'all' || p.category === category)
    .sort((a, b) => {
      if (sort === 'curated') {
        // Use the 'order' field for sorting, falling back to 999 if not set (null/undefined)
        // If orders are equal, fallback to created_date
        const orderA = a.order ?? 999;
        const orderB = b.order ?? 999;
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
        className="relative h-[60vh] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: 'url(https://static.wixstatic.com/media/c1b522_b13b1f361627437baf0908a2f28923ee~mv2.jpeg/v1/fill/w_1920,h_1080,fp_0.52_0.77,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/c1b522_b13b1f361627437baf0908a2f28923ee~mv2.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
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
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <ProjectFilters onFilterChange={setCategory} onSortChange={setSort} />

          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <p className="text-gray-500">Loading projects...</p>
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
      <section className="py-24 bg-gray-50">
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