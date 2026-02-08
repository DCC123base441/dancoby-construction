import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const heroImages = [
  "https://static.wixstatic.com/media/c1b522_066e32d57b844b4893dd7de976dd6613~mv2.jpeg/v1/fill/w_1920,h_1080,fp_0.52_0.44,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/c1b522_066e32d57b844b4893dd7de976dd6613~mv2.jpeg",
  "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697c18d2dbda3b3101bfe937/99a553c33_Dancoby_PenthouseFinished_Shot9.jpg",
  "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697c18d2dbda3b3101bfe937/01286028a_Dancoby_PenthouseFinished_Shot15.jpg",
  "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697c18d2dbda3b3101bfe937/484896910_Dancoby_849Central_15.jpg"
];

const DURATION = 7000; // time each image is shown

export default function HeroImageFade() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % heroImages.length);
    }, DURATION);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0">
      <AnimatePresence initial={false}>
        <motion.div
          key={currentIndex}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImages[currentIndex]})` }}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ opacity: { duration: 1.5, ease: "easeInOut" }, scale: { duration: DURATION / 1000, ease: "linear" } }}
        />
      </AnimatePresence>
    </div>
  );
}