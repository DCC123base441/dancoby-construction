import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';

const ORIGINAL_VAN_URL = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697c18d2dbda3b3101bfe937/2735193cb_79253312687__21808B29-B752-4A18-9D29-1AF223044461.jpg";

export default function VanImageSection() {
  const [vanImageUrl, setVanImageUrl] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  useEffect(() => {
    // Check if we already have a generated image cached in localStorage
    const cached = localStorage.getItem('dancoby_van_image');
    if (cached) {
      setVanImageUrl(cached);
      setHasGenerated(true);
    } else {
      generateVanImage();
    }
  }, []);

  const generateVanImage = async () => {
    setIsGenerating(true);
    try {
      const result = await base44.integrations.Core.GenerateImage({
        prompt: "A professional branded construction company Ford Transit van with grey and white geometric diamond wrap pattern parked on a beautiful clean Brooklyn NYC street with brownstone buildings. Bright sunny day, professional commercial photography, clean polished look. Keep the van design exactly as the reference image but place it on a beautiful NYC Brooklyn street instead of a warehouse.",
        existing_image_urls: [ORIGINAL_VAN_URL]
      });
      if (result?.url) {
        setVanImageUrl(result.url);
        localStorage.setItem('dancoby_van_image', result.url);
        setHasGenerated(true);
      }
    } catch (err) {
      console.warn('Image generation failed, using original', err);
    }
    setIsGenerating(false);
  };

  const displayUrl = vanImageUrl || ORIGINAL_VAN_URL;

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: 0.2 }}
      className="relative"
    >
      <div className="relative">
        {isGenerating && !vanImageUrl && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-100 rounded-xl">
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-gray-500">Enhancing image...</p>
            </div>
          </div>
        )}
        <img
          src={displayUrl}
          alt="Dancoby Construction Van"
          className="w-full rounded-xl shadow-2xl object-cover"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute -bottom-4 -right-4 bg-red-600 text-white px-5 py-3 rounded-lg shadow-lg">
          <p className="text-xs font-bold uppercase tracking-wider">Serving All of NYC</p>
        </div>
      </div>
    </motion.div>
  );
}