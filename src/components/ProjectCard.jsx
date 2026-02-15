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
        {/* Image */}
        <div className="relative overflow-hidden bg-stone-100 aspect-[3/4] mb-5">
          <OptimizedImage 
            src={project.mainImage}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-700" />
          
          {/* View label */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <span className="flex items-center gap-2 text-white text-xs font-medium uppercase tracking-[0.25em] bg-black/50 backdrop-blur-sm px-5 py-2.5">
              View Project <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Category tag */}
          <div className="absolute top-4 left-4">
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/90 bg-black/40 backdrop-blur-sm px-3 py-1.5">
              {project.category}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-2">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="text-lg font-medium text-stone-900 group-hover:text-stone-600 transition-colors duration-300 leading-tight">
              {project.title}
            </h3>
            <ArrowUpRight className="w-4 h-4 text-stone-300 group-hover:text-red-500 transition-colors duration-300 flex-shrink-0 mt-1" />
          </div>
          {project.location && (
            <p className="text-xs text-stone-400 uppercase tracking-wider">{project.location}</p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}