import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { createPageUrl } from '../utils';
import { ArrowLeft } from 'lucide-react';
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
        <p className="text-gray-600">Loading project...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <SEOHead 
        title={`${project.title} | Dancoby Construction Project`}
        description={project.description?.slice(0, 160) || `View the ${project.title} renovation project by Dancoby Construction. Expert craftsmanship in Brooklyn & Long Island.`}
        keywords={`${project.title}, ${project.category} renovation, Dancoby Construction project, ${project.location || 'Brooklyn Long Island'} renovation, general contractor portfolio`}
        ogImage={project.mainImage}
      />


      {/* Hero Image */}
      {project.mainImage && (
        <section className="relative h-[50vh] md:h-[65vh] overflow-hidden">
          <img
            src={project.mainImage}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </section>
      )}

      {/* Project Details */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6 md:px-10">
          <div className="mb-10">
            <Link to={createPageUrl('Projects')} className="inline-flex items-center gap-2 text-stone-400 hover:text-stone-900 transition-colors text-sm tracking-wide">
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Portfolio
            </Link>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-20"
          >
            {/* Title & Description */}
            <div className="max-w-3xl">
              <p className="text-[11px] uppercase tracking-[0.25em] text-stone-400 font-medium mb-5">
                {project.logoText || project.category}
                {project.location && (
                  <span className="ml-3 text-stone-300">·  {project.location}</span>
                )}
              </p>
              <h1 className="text-3xl md:text-[2.75rem] font-light text-stone-900 leading-[1.2] mb-6 tracking-wide">
                {project.title}
              </h1>
              <p className="text-base md:text-lg text-stone-500 leading-relaxed font-light">
                {project.description}
              </p>
            </div>

            {/* Stats & Materials */}
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
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-px flex-1 bg-stone-200" />
                  <h2 className="text-[13px] uppercase tracking-[0.25em] text-stone-500 font-medium">Highlights</h2>
                  <div className="h-px flex-1 bg-stone-200" />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {project.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-start gap-4 py-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-stone-900 mt-2 flex-shrink-0" />
                      <span className="text-stone-600 leading-relaxed">{highlight}</span>
                    </div>
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
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-px flex-1 bg-stone-200" />
                  <h2 className="text-[13px] uppercase tracking-[0.25em] text-stone-500 font-medium">Client Words</h2>
                  <div className="h-px flex-1 bg-stone-200" />
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  {project.testimonials.map((testimonial, idx) => (
                    <TestimonialCard key={idx} testimonial={testimonial} index={idx} />
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="pt-10 border-t border-stone-200">
              <div className="flex flex-wrap gap-4">
                <Button 
                  asChild 
                  className="bg-stone-900 hover:bg-stone-800 text-white px-8 h-11 text-[11px] uppercase tracking-[0.2em]"
                >
                  <Link to={createPageUrl('Contact')}>
                    Start Your Project
                  </Link>
                </Button>
                <Button 
                  asChild 
                  variant="outline"
                  className="border-stone-300 text-stone-700 hover:bg-stone-50 px-8 h-11 text-[11px] uppercase tracking-[0.2em]"
                >
                  <Link to={createPageUrl('Projects')}>
                    View All Projects
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}