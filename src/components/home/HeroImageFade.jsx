import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

const fallbackImages = [
  "https://static.wixstatic.com/media/c1b522_066e32d57b844b4893dd7de976dd6613~mv2.jpeg/v1/fill/w_1920,h_1080,fp_0.52_0.44,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/c1b522_066e32d57b844b4893dd7de976dd6613~mv2.jpeg"
];

const DURATION = 7000;

export default function HeroImageFade() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data: heroImages = [] } = useQuery({
    queryKey: ['heroImages'],
    queryFn: () => base44.entities.HeroImage.list('order'),
  });

  const activeImages = heroImages.filter(img => img.isActive).map(img => img.imageUrl);
  const images = activeImages.length > 0 ? activeImages : fallbackImages;

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % images.length);
    }, DURATION);
    return () => clearInterval(interval);
  }, [images.length]);

  // Reset index if it's out of bounds
  const safeIndex = currentIndex % (images.length || 1);

  return (
    <div className="absolute inset-0">
      <AnimatePresence initial={false}>
        <motion.div
          key={safeIndex}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${images[safeIndex]})` }}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ opacity: { duration: 1.5, ease: "easeInOut" }, scale: { duration: DURATION / 1000, ease: "linear" } }}
        />
      </AnimatePresence>
    </div>
  );
}