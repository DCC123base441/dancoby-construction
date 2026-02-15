import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { createPageUrl } from '../utils';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';

import TestimonialCard from '../components/TestimonialCard';
import ProjectStats from '../components/ProjectStats';
import ProjectGallery from '../components/ProjectGallery';
import SEOHead from '../components/SEOHead';

export default function ProjectDetail() {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('id');

  const { data: project, isLoading } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => base44.entities.Project.get(projectId),
    enabled: !!projectId,
    initialData: null
  });

  if (isLoading || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-6 h-6 border-2 border-stone-300 border-t-stone-900 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <SEOHead 
        title={`${project.title} | Dancoby Construction Project`}
        description={project.description?.slice(0, 160) || `View the ${project.title} renovation project by Dancoby Construction.`}
        keywords={`${project.title}, ${project.category} renovation, Dancoby Construction`}
        ogImage={project.mainImage}
      />

      {/* Immersive Hero */}
      <section className="relative h-[70vh] md:h-[85vh] overflow-hidden">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <img
            src={project.mainImage}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
        
        {/* Back button */}
        <div className="absolute top-6 left-6 z-20">
          <Link 
            to={createPageUrl('Projects')} 
            className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm font-light tracking-wide bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full"
          >
            <ArrowLeft className="w-4 h-4" />
            All Projects
          </Link>
        </div>

        {/* Hero text overlay */}
        <div className="absolute bottom-0 left-0 right-0 z-10 px-6 pb-12 md:pb-20">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <p className="text-white/40 text-[10px] md:text-[11px] uppercase tracking-[0.4em] mb-3">
                {project.logoText || project.category}
              </p>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-extralight text-white tracking-tight leading-[1.1] mb-3">
                {project.title}
              </h1>
              {project.location && (
                <p className="text-white/40 text-sm tracking-wider">{project.location}</p>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-20"
          >
            {/* Description */}
            <div className="max-w-3xl">
              <div className="h-px w-16 bg-red-500 mb-8" />
              <p className="text-lg md:text-xl text-stone-600 leading-relaxed font-light">
                {project.description}
              </p>
            </div>

            {/* Stats */}
            {(project.budget || project.timeline || project.materials) && (
              <ProjectStats 
                budget={project.budget}
                timeline={project.timeline}
                materials={project.materials}
              />
            )}

            {/* Highlights */}
            {project.highlights && project.highlights.length > 0 && (
              <div>
                <p className="text-[11px] uppercase tracking-[0.3em] text-stone-400 font-medium mb-8">
                  Project Highlights
                </p>
                <div className="grid md:grid-cols-2 gap-x-12 gap-y-5">
                  {project.highlights.map((highlight, idx) => (
                    <motion.div 
                      key={idx} 
                      className="flex items-start gap-4 py-3 border-b border-stone-100"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <span className="text-red-500 text-sm font-light mt-0.5">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className="text-stone-700 text-base font-light">{highlight}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Gallery */}
            {project.images && project.images.length > 0 && (
              <ProjectGallery images={project.images} />
            )}

            {/* Testimonials */}
            {project.testimonials && project.testimonials.length > 0 && (
              <div>
                <p className="text-[11px] uppercase tracking-[0.3em] text-stone-400 font-medium mb-8">
                  Client Testimonials
                </p>
                <div className="grid md:grid-cols-2 gap-8">
                  {project.testimonials.map((testimonial, idx) => (
                    <TestimonialCard key={idx} testimonial={testimonial} index={idx} />
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="pt-12 border-t border-stone-200">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div>
                  <p className="text-stone-900 font-medium text-lg mb-1">Inspired by this project?</p>
                  <p className="text-stone-400 text-sm font-light">Let's talk about bringing your vision to life.</p>
                </div>
                <div className="flex gap-3">
                  <Button 
                    asChild 
                    className="bg-stone-900 hover:bg-stone-800 text-white px-8 h-11 text-xs uppercase tracking-[0.2em] rounded-none"
                  >
                    <Link to={createPageUrl('Contact')}>
                      Start Your Project
                    </Link>
                  </Button>
                  <Button 
                    asChild 
                    variant="outline"
                    className="border-stone-300 text-stone-700 hover:bg-stone-50 px-6 h-11 text-xs uppercase tracking-[0.2em] rounded-none"
                  >
                    <Link to={createPageUrl('Projects')}>
                      More Projects <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}