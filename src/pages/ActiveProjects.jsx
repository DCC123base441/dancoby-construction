import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { ArrowLeft } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import OptimizedImage from "@/components/ui/OptimizedImage";

export default function ActiveProjects() {
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['currentProjects'],
    queryFn: () => base44.entities.CurrentProject.list('order'),
  });

  // Fallback data if DB is empty
  const displayProjects = projects.length > 0 ? projects.filter(p => !p.featuredOnHome) : [
    {
      image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697acd732615bf21166f211d/b3aa5d359_Photo5.jpg",
      status: 95,
      title: "Mudroom Addition",
      location: "Woodmere, New York",
      description: "Mudroom addition and powder room."
    },
    {
      image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697acd732615bf21166f211d/bd8398692_Photo51.jpg",
      status: 25,
      title: "Entire Home",
      location: "Hewlett, New York",
      description: "Full home renovation featuring luxury baths."
    }
  ];

  return (
    <main className="min-h-screen bg-gray-50 py-16 md:py-24">
      <SEOHead 
        title="Active Projects | Dancoby Construction" 
        description="See what we're working on right now. Current renovations in Brooklyn, Queens, and Long Island."
        keywords="active construction projects NYC, current renovations Brooklyn, home renovation in progress, Long Island renovation projects, NYC construction updates"
      />
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8">
            <Button asChild variant="ghost" className="hover:bg-transparent pl-0 hover:text-red-600">
                <Link to={createPageUrl('Home')} className="flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                </Link>
            </Button>
        </div>
        <div className="text-center mb-16">
          <p className="text-xs tracking-[2px] text-[#a39e96] uppercase mb-4">Under Construction</p>
          <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">What We're Up To</h1>
          <p className="text-lg text-[#78716b] max-w-2xl mx-auto font-light">
            A behind-the-scenes look at our active job sites.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {displayProjects.map((project, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
            >
              <div className="relative aspect-[4/3] bg-[#d6cec3]">
                <OptimizedImage 
                  src={project.image} 
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.1]"
                />
                <div className="absolute top-4 right-4 bg-white/95 p-4 min-w-[160px] shadow-sm backdrop-blur-sm rounded-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold tracking-widest uppercase text-gray-500">Progress</span>
                    <span className="text-xs font-bold text-red-600">{parseInt(project.status)}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${parseInt(project.status)}%` }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                      className="h-full bg-red-600"
                    />
                  </div>
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-light text-gray-900 mb-2">{project.title}</h3>
                <p className="text-xs font-bold tracking-wider uppercase text-red-600 mb-4">{project.location}</p>
                <p className="text-[#5b5854] leading-relaxed">{project.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
        
        {projects.length === 0 && !isLoading && (
            <div className="text-center py-12">
                <p className="text-gray-500">No active projects at the moment. Check back soon!</p>
            </div>
        )}
      </div>
    </main>
  );
}