import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import SEOHead from '../components/SEOHead';

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState('All');

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => base44.entities.Project.list('-order', 50),
    initialData: [],
  });

  const categories = ['All', 'Residential', 'Commercial', 'Renovation', 'Restoration'];

  const filteredProjects = activeFilter === 'All' 
    ? projects 
    : projects.filter(p => p.category === activeFilter);

  const fallbackProjects = [
    { id: 1, title: 'Park Slope Brownstone', category: 'Restoration', mainImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80', description: 'Complete restoration of a historic Brooklyn brownstone' },
    { id: 2, title: 'Brooklyn Heights Kitchen', category: 'Renovation', mainImage: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80', description: 'Modern kitchen renovation with custom cabinetry' },
    { id: 3, title: 'Tribeca Loft', category: 'Residential', mainImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80', description: 'Industrial loft transformation' },
    { id: 4, title: 'Upper West Side Classic', category: 'Residential', mainImage: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800&q=80', description: 'Classic pre-war apartment renovation' },
    { id: 5, title: 'Williamsburg Studio', category: 'Commercial', mainImage: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&q=80', description: 'Creative studio buildout' },
    { id: 6, title: 'Fort Greene Townhouse', category: 'Restoration', mainImage: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80', description: 'Full townhouse restoration' },
  ];

  const displayProjects = filteredProjects.length > 0 ? filteredProjects : fallbackProjects.filter(p => activeFilter === 'All' || p.category === activeFilter);

  return (
    <main className="bg-[#faf9f7]">
      <SEOHead 
        title="Our Projects | NYC Home Renovation Portfolio"
        description="Browse our portfolio of NYC home renovations. Kitchen remodels, bathroom renovations, brownstone restorations, and full home transformations."
      />

      {/* Hero */}
      <section className="pt-32 pb-16 lg:pt-40 lg:pb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="max-w-3xl">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs tracking-[0.3em] uppercase text-[#8b7355] mb-6"
            >
              Our Portfolio
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl lg:text-6xl font-light leading-[1.1] text-[#2d2d2d] mb-8"
            >
              Featured<br /><span className="italic">Projects</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-[#2d2d2d]/70 leading-relaxed"
            >
              Explore our collection of transformations across New York City. 
              Each project tells a unique story of collaboration, craftsmanship, and vision.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="pb-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-wrap gap-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-6 py-3 text-xs tracking-[0.15em] uppercase transition-all duration-300 ${
                  activeFilter === cat
                    ? 'bg-[#2d2d2d] text-white'
                    : 'border border-[#e8e4df] text-[#2d2d2d] hover:border-[#2d2d2d]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="pb-24 lg:pb-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayProjects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link 
                  to={`${createPageUrl('ProjectDetail')}?id=${project.id}`}
                  className="group block"
                >
                  <div className="aspect-[4/3] overflow-hidden mb-6">
                    <img 
                      src={project.mainImage}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <p className="text-xs tracking-[0.2em] uppercase text-[#8b7355] mb-2">
                    {project.category}
                  </p>
                  <h3 className="text-xl font-light text-[#2d2d2d] mb-2 group-hover:text-[#8b7355] transition-colors">
                    {project.title}
                  </h3>
                  {project.description && (
                    <p className="text-sm text-[#2d2d2d]/60 leading-relaxed">
                      {project.description}
                    </p>
                  )}
                </Link>
              </motion.div>
            ))}
          </div>

          {displayProjects.length === 0 && !isLoading && (
            <div className="text-center py-16">
              <p className="text-[#2d2d2d]/60">No projects found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-[#8b7355] mb-6">Your Vision, Our Craft</p>
          <h2 className="text-4xl lg:text-5xl font-light text-[#2d2d2d] mb-8">
            Ready to Start<br /><span className="italic">Your Project?</span>
          </h2>
          <Link
            to={createPageUrl('Contact')}
            className="inline-flex items-center gap-3 px-10 py-5 bg-[#2d2d2d] text-white text-sm tracking-[0.15em] uppercase hover:bg-[#8b7355] transition-colors duration-300"
          >
            Get in Touch
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}