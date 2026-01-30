import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { createPageUrl } from '../utils';
import { ArrowLeft } from 'lucide-react';
import ProjectSlideshow from '../components/ProjectSlideshow';

const projectsData = [
  {
    id: 1,
    title: "Master bathroom renovation with heated marble floors and custom vanity cabinetry",
    logo: "Luxury Bath Remodel",
    image: "https://static.wixstatic.com/media/c1b522_51ff5023986c46a88a21cb6a2bae4e3c~mv2.jpeg/v1/fill/w_334,h_457,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Dancoby_Penthouse%20Finished%20Shot%2017.jpeg",
    description: "A stunning master bathroom renovation featuring heated marble floors, custom vanity cabinetry, and luxury finishes. This transformation combines functionality with elegant design for the ultimate spa-like experience.",
    details: [
      "Heated marble flooring throughout",
      "Custom vanity cabinetry with premium hardware",
      "Luxury tile work and fixtures",
      "Modern lighting and ventilation"
    ]
  },
  {
    id: 2,
    title: "Open-concept kitchen and living space with custom millwork and premium finishes",
    logo: "Kitchen + Living Renovation",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697c18d2dbda3b3101bfe937/9a456ccc4_Dancoby_92ConklinKitchen_091.jpg",
    images: [
      "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697c18d2dbda3b3101bfe937/9a456ccc4_Dancoby_92ConklinKitchen_091.jpg",
      "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697c18d2dbda3b3101bfe937/c7315d418_Dancoby_ConklinBathroom_Shot2_V3_1.jpg",
      "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697c18d2dbda3b3101bfe937/294eb6f07_Dancoby_ConklinBathroom_Shot3_V2.jpg",
      "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697c18d2dbda3b3101bfe937/0d3ef38ea_Dancoby_ConklinBathroom_Shot4.jpg",
      "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697c18d2dbda3b3101bfe937/553eb3b1d_Dancoby_ConklinBathroom_Shot5.jpg",
      "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697c18d2dbda3b3101bfe937/0c9031cef_Dancoby_ConklinBathroom_Shot6.jpg"
    ],
    description: "A comprehensive kitchen and living space renovation that seamlessly integrates modern open-concept design with custom millwork and premium finishes throughout.",
    details: [
      "Open-concept floor plan",
      "Custom cabinetry and millwork",
      "Premium appliances and fixtures",
      "Integrated lighting design"
    ]
  },
  {
    id: 3,
    title: "Complete brownstone interior transformation with custom architectural details",
    logo: "Brownstone Restoration",
    image: "https://static.wixstatic.com/media/c1b522_53439da5911740bcb80bd2033a393841~mv2.jpg/v1/fill/w_334,h_457,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/VAN_SARKI_STUDIO_8_PARK_SLOPE_2300.jpg",
    description: "A complete interior transformation of a historic brownstone, preserving original charm while integrating modern amenities and custom architectural details.",
    details: [
      "Historic preservation",
      "Custom architectural details",
      "Modern integration",
      "High-end finishes"
    ]
  },
  {
    id: 4,
    title: "Penthouse renovation featuring floor-to-ceiling windows and custom design elements",
    logo: "Penthouse Upgrade",
    image: "https://static.wixstatic.com/media/c1b522_f3b8352ead454119b6fafb74781ff327~mv2.jpg/v1/fill/w_334,h_457,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/villier_living1_lightsoff.jpg",
    description: "A luxury penthouse renovation showcasing floor-to-ceiling windows and custom design elements that maximize natural light and modern elegance.",
    details: [
      "Floor-to-ceiling windows",
      "Custom design elements",
      "Luxury finishes",
      "Optimal space utilization"
    ]
  }
];

export default function ProjectDetail() {
  const [searchParams] = useSearchParams();
  const projectId = parseInt(searchParams.get('id')) || 1;
  const project = projectsData.find(p => p.id === projectId) || projectsData[0];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-16 z-40 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link to={createPageUrl('Projects')} className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Link>
        </div>
      </div>

      {/* Project Image/Slideshow */}
      <section className="py-12">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {project.images ? (
              <ProjectSlideshow images={project.images} />
            ) : (
              <img 
                src={project.image}
                alt={project.title}
                className="w-full h-auto object-contain"
              />
            )}
          </motion.div>
        </div>
      </section>

      {/* Project Details */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-8"
          >
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3">
                {project.logo}
              </p>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                {project.title}
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                {project.description}
              </p>
            </div>

            {project.details && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Project Highlights</h2>
                <ul className="grid md:grid-cols-2 gap-4">
                  {project.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-red-600 mt-2 flex-shrink-0" />
                      <span className="text-gray-700">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-8 border-t border-gray-200">
              <div className="flex flex-wrap gap-4">
                <Button 
                  asChild 
                  className="bg-gray-900 hover:bg-gray-800 text-white px-8"
                >
                  <Link to={createPageUrl('Contact')}>
                    Inquire About Similar Work
                  </Link>
                </Button>
                <Button 
                  asChild 
                  variant="outline"
                  className="border-gray-300 text-gray-900 hover:bg-gray-50 px-8"
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