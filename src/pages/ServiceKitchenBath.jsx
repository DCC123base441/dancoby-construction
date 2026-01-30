import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';

export default function ServiceKitchenBath() {
  const fadeIn = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: () => base44.entities.Project.list()
  });

  const serviceProjects = projects.filter(p => p.category === 'Renovation').slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697c18d2dbda3b3101bfe937/9a456ccc4_Dancoby_92ConklinKitchen_091.jpg)'
          }}
        />
        <div className="absolute inset-0 bg-black/40" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center text-white max-w-3xl px-6"
        >
          <div className="h-1 w-16 bg-red-600 mx-auto mb-6" />
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">Kitchen & Bath Remodeling</h1>
          <p className="text-xl text-white/90">Modern upgrades tailored to your lifestyle with premium materials and expert craftsmanship</p>
        </motion.div>
      </section>

      {/* Service Overview */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div {...fadeIn} className="mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">About This Service</h2>
            <p className="text-lg text-gray-700 leading-relaxed max-w-3xl">
              Kitchens and bathrooms are the heart of any home. Our specialized remodeling services combine cutting-edge design with premium materials and expert installation to create spaces that are both beautiful and highly functional. We focus on maximizing your space while incorporating the latest trends and technologies.
            </p>
          </motion.div>

          <motion.div {...fadeIn} className="grid md:grid-cols-2 gap-12">
            <div>
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697c18d2dbda3b3101bfe937/c7315d418_Dancoby_ConklinBathroom_Shot2_V3_1.jpg"
                alt="Kitchen & Bath"
                className="w-full h-auto rounded-lg"
              />
            </div>
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-gray-900">What We Offer</h3>
              <ul className="space-y-4">
                {[
                  'Custom cabinetry and vanity design',
                  'Premium countertop materials (quartz, granite, marble)',
                  'High-end appliance selection and installation',
                  'Modern fixture upgrades and plumbing',
                  'Tile work and backsplash design',
                  'Lighting and ventilation systems',
                  'Smart storage solutions'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2 {...fadeIn} className="text-4xl font-bold text-gray-900 mb-16 text-center">
            Our Remodeling Process
          </motion.h2>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Design Consultation',
                description: 'Discuss your style, needs, and budget while exploring design options and material samples.'
              },
              {
                step: '02',
                title: 'Material Selection',
                description: 'Choose from premium fixtures, countertops, cabinetry, and appliances with our expert guidance.'
              },
              {
                step: '03',
                title: 'Renovation',
                description: 'Our licensed contractors handle all demolition, plumbing, electrical, and installation work.'
              },
              {
                step: '04',
                title: 'Final Touches',
                description: 'Quality inspections, styling, and final walkthrough to ensure perfection.'
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-lg p-8 border border-gray-200"
              >
                <div className="text-4xl font-bold text-red-600 mb-4">{item.step}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Showcase */}
      {serviceProjects.length > 0 && (
        <section className="py-24 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <motion.h2 {...fadeIn} className="text-4xl font-bold text-gray-900 mb-16 text-center">
              Featured Kitchen & Bath Projects
            </motion.h2>

            <div className="grid md:grid-cols-3 gap-8">
              {serviceProjects.map((project, idx) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="group"
                >
                  <div className="relative overflow-hidden mb-6 bg-gray-200 aspect-[4/5]">
                    <img 
                      src={project.mainImage}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{project.title}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{project.description}</p>
                  <Button 
                    asChild 
                    className="bg-gray-900 hover:bg-gray-800 text-white h-auto py-2 px-4 text-xs uppercase tracking-wider"
                  >
                    <Link to={`${createPageUrl('ProjectDetail')}?id=${project.id}`}>
                      View Project <ArrowRight className="w-3 h-3 ml-2" />
                    </Link>
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-32 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div {...fadeIn}>
            <h2 className="text-4xl md:text-5xl font-bold mb-8">Upgrade Your Kitchen or Bath Today</h2>
            <p className="text-xl text-gray-300 mb-12">
              Let's create a beautiful, functional space you'll love for years to come
            </p>
            <Button asChild size="lg" className="bg-red-600 hover:bg-red-700 text-white px-10">
              <Link to={createPageUrl('Contact')}>Start Your Remodel</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}