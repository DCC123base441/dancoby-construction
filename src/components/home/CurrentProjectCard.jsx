import React, { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import CurrentProjectGallery from './CurrentProjectGallery';

export default function CurrentProjectCard({ project, idx, status, getColor, getBgColor }) {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.4 });
  const [galleryOpen, setGalleryOpen] = useState(false);

  const allImages = [project.image, ...(project.gallery || [])].filter(Boolean);

  return (
    <>
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: idx * 0.1 }}
        className="group"
      >
        <div
          className="relative mb-6 overflow-hidden bg-[#d6cec3] aspect-[4/3] cursor-pointer"
          onClick={() => setGalleryOpen(true)}
        >
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.1]"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-700 z-20" />
          <div className="absolute top-4 right-4 bg-white/95 p-4 min-w-[160px] shadow-sm backdrop-blur-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-bold tracking-widest uppercase text-gray-500">Progress</span>
              <span className={`text-xs font-bold ${getColor()}`}>{status}%</span>
            </div>
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full ${getBgColor()} origin-left hidden md:block scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 ease-out`}
                style={{ width: `${status}%` }}
              />
              <div
                className={`h-full ${getBgColor()} origin-left md:hidden rounded-full`}
                style={{
                  width: `${status}%`,
                  transform: isInView ? 'scaleX(1)' : 'scaleX(0)',
                  transition: 'transform 1s ease-out'
                }}
              />
            </div>
          </div>
        </div>
        <h3 className="text-2xl md:text-3xl font-light text-gray-900 mb-2">{project.title}</h3>
        <p className="text-xs font-bold tracking-wider uppercase text-red-600 mb-4">{project.location}</p>
        <p className="text-[#5b5854] leading-relaxed">{project.description}</p>
      </motion.div>

      <AnimatePresence>
        {galleryOpen && (
          <CurrentProjectGallery
            images={allImages}
            initialIndex={0}
            onClose={() => setGalleryOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}