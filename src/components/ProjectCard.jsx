import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { ArrowRight } from 'lucide-react';

export default function ProjectCard({ project }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group flex flex-col h-full"
    >
      <div className="relative overflow-hidden mb-6 bg-gray-200 aspect-[4/5]">
        <img 
          src={project.mainImage}
          alt={project.title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300" />
      </div>

      <div className="flex flex-col flex-1">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
            {project.category}
          </span>
          <span className="text-xs font-medium text-gray-500">{project.location}</span>
        </div>
        
        <h3 className="text-lg font-medium text-gray-900 leading-tight group-hover:text-gray-700 transition-colors mb-3">
          {project.title}
        </h3>
        
        <p className="text-sm text-gray-600 line-clamp-2 mb-4">
          {project.description}
        </p>

        <div className="mt-auto">
          <Button 
            asChild 
            className="bg-gray-900 hover:bg-gray-800 text-white h-auto py-2 px-4 text-xs uppercase tracking-wider group-hover:gap-2"
          >
            <Link to={`${createPageUrl('ProjectDetail')}?id=${project.id}`}>
              View Project <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}