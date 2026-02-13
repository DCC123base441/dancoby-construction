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


      {/* Project Details */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-8">
            <Link to={createPageUrl('Projects')} className="inline-flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors font-medium">
              <ArrowLeft className="w-4 h-4" />
              Back to Projects
            </Link>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-16"
          >
            {/* Title & Description */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">
                {project.logoText || project.category}
              </p>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                {project.title}
              </h1>
              <p className="text-lg text-gray-700 leading-relaxed max-w-3xl">
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
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Project Highlights</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {project.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-start gap-4">
                      <div className="w-2 h-2 rounded-full bg-red-600 mt-3 flex-shrink-0" />
                      <span className="text-gray-700 text-lg">{highlight}</span>
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
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Client Testimonials</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  {project.testimonials.map((testimonial, idx) => (
                    <TestimonialCard key={idx} testimonial={testimonial} index={idx} />
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="pt-8 border-t border-gray-300">
              <div className="flex flex-wrap gap-4">
                <Button 
                  asChild 
                  className="bg-gray-900 hover:bg-gray-800 text-white px-8 h-12 text-sm uppercase tracking-wider"
                >
                  <Link to={createPageUrl('Contact')}>
                    Start Your Project
                  </Link>
                </Button>
                <Button 
                  asChild 
                  variant="outline"
                  className="border-gray-400 text-gray-900 hover:bg-gray-100 px-8 h-12 text-sm uppercase tracking-wider"
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