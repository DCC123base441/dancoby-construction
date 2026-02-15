import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { ArrowUpRight } from 'lucide-react';
import OptimizedImage from './OptimizedImage';

export default function ProjectCard({ project, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
    >
      <Link
        to={`${createPageUrl('ProjectDetail')}?id=${project.id}`}
        className="group block"
      >
        {/* Image Container — fixed aspect ratio, no stretch */}
        <div className="relative overflow-hidden bg-stone-100 aspect-[3/4] mb-5">
          <OptimizedImage
            src={project.mainImage}
            alt={project.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[800ms] ease-out group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {/* Subtle bottom gradient for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Hover arrow */}
          <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            <ArrowUpRight className="w-4 h-4 text-stone-900" />
          </div>
        </div>

        {/* Info */}
        <div className="space-y-1.5">
          <p className="text-[11px] uppercase tracking-[0.2em] text-stone-400 font-medium">
            {project.category}
            {project.location && (
              <>
                <span className="mx-2 text-stone-300">·</span>
                {project.location}
              </>
            )}
          </p>
          <h3 className="text-lg font-normal text-stone-900 group-hover:text-stone-600 transition-colors duration-300">
            {project.title}
          </h3>
        </div>
      </Link>
    </motion.div>
  );
}