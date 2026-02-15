import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { ArrowRight } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";

export default function FeaturedProjectsShowcase({ title = "Featured Projects", maxProjects = 4 }) {
  const { data: featuredProjects = [] } = useQuery({
    queryKey: ['featuredProjects'],
    queryFn: () => base44.entities.Project.filter({ featured: true }, 'order'),
  });

  const projects = featuredProjects.slice(0, maxProjects);

  if (projects.length === 0) return null;

  // Layout: first project large, rest in a grid
  const [hero, ...rest] = projects;

  return (
    <section className="py-20 md:py-28 bg-stone-50">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <p className="text-[11px] uppercase tracking-[0.3em] text-stone-400 font-medium mb-3">{title}</p>
          <div className="flex items-end justify-between">
            <h2 className="text-3xl md:text-4xl font-light text-stone-900 tracking-wide">
              Our Best <em className="italic">Work</em>
            </h2>
            <Button asChild variant="link" className="text-stone-600 hover:text-red-600 hidden md:flex">
              <Link to={createPageUrl('Projects')}>
                View All Projects <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Hero + Side Grid Layout */}
        <div className="grid lg:grid-cols-2 gap-5">
          {/* Large Hero Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Link
              to={`${createPageUrl('ProjectDetail')}?id=${hero.id}`}
              className="group block relative overflow-hidden bg-stone-200 aspect-[4/5] lg:aspect-auto lg:h-full"
            >
              <img
                src={hero.mainImage}
                alt={hero.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <p className="text-[10px] uppercase tracking-[0.25em] text-white/60 mb-2 font-medium">
                  {hero.logoText || hero.location || 'Featured'}
                </p>
                <h3 className="text-xl md:text-2xl font-light text-white leading-snug mb-3">
                  {hero.title}
                </h3>
                <span className="inline-flex items-center text-xs text-white/80 group-hover:text-red-400 transition-colors uppercase tracking-wider font-medium">
                  View Project <ArrowRight className="w-3 h-3 ml-1.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Side Grid */}
          <div className="grid grid-cols-2 gap-5">
            {rest.map((project, idx) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (idx + 1) * 0.1 }}
              >
                <Link
                  to={`${createPageUrl('ProjectDetail')}?id=${project.id}`}
                  className="group block relative overflow-hidden bg-stone-200 aspect-[3/4]"
                >
                  <img
                    src={project.mainImage}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                    <p className="text-[9px] uppercase tracking-[0.2em] text-white/50 mb-1 font-medium">
                      {project.logoText || project.location || 'Featured'}
                    </p>
                    <h3 className="text-sm md:text-base font-light text-white leading-snug line-clamp-2">
                      {project.title}
                    </h3>
                  </div>
                </Link>
              </motion.div>
            ))}

            {/* Fill empty slots if less than 3 side projects */}
            {rest.length < 3 && rest.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className={rest.length === 1 ? 'col-span-1' : ''}
              >
                <Link
                  to={createPageUrl('Projects')}
                  className="group flex flex-col items-center justify-center bg-stone-100 aspect-[3/4] border border-stone-200 hover:border-stone-300 transition-colors"
                >
                  <ArrowRight className="w-8 h-8 text-stone-300 group-hover:text-red-500 transition-colors mb-3 group-hover:translate-x-1 duration-300" />
                  <span className="text-xs uppercase tracking-wider text-stone-400 group-hover:text-stone-600 transition-colors font-medium">
                    See All Projects
                  </span>
                </Link>
              </motion.div>
            )}
          </div>
        </div>

        {/* Mobile view all button */}
        <div className="mt-10 text-center md:hidden">
          <Button asChild className="bg-stone-900 hover:bg-stone-800 text-white text-sm tracking-wide px-6">
            <Link to={createPageUrl('Projects')}>View All Projects</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}