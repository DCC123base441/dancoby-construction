import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import OptimizedImage from "@/components/OptimizedImage";

export default function ProjectGallery({ images }) {
    const [selectedIndex, setSelectedIndex] = useState(null);

    if (!images || images.length === 0) return null;

    const handlePrevious = (e) => {
        e.stopPropagation();
        setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNext = (e) => {
        e.stopPropagation();
        setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowLeft') handlePrevious(e);
        if (e.key === 'ArrowRight') handleNext(e);
        if (e.key === 'Escape') setSelectedIndex(null);
    };

    useEffect(() => {
        if (selectedIndex !== null) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [selectedIndex]);

    // Masonry-like layout: first image large, rest in grid
    const heroImage = images[0];
    const gridImages = images.slice(1);

    return (
        <div className="space-y-6">
            <p className="text-[11px] uppercase tracking-[0.3em] text-stone-400 font-medium">
                Project Gallery
            </p>
            
            {/* Hero + Grid Layout */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
                {/* Large hero image */}
                <motion.div
                    className="col-span-2 row-span-2 relative group cursor-pointer overflow-hidden bg-stone-100 aspect-square"
                    onClick={() => setSelectedIndex(0)}
                    whileHover={{ scale: 1.005 }}
                    transition={{ duration: 0.3 }}
                >
                    <OptimizedImage 
                        src={heroImage} 
                        alt="Gallery image 1"
                        fill
                        className="transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100 z-20">
                        <Maximize2 className="w-6 h-6 text-white drop-shadow-lg" />
                    </div>
                </motion.div>

                {/* Remaining images */}
                {gridImages.map((image, idx) => (
                    <motion.div 
                        key={idx + 1}
                        className="group relative aspect-square cursor-pointer overflow-hidden bg-stone-100"
                        onClick={() => setSelectedIndex(idx + 1)}
                        whileHover={{ scale: 1.005 }}
                        transition={{ duration: 0.3 }}
                    >
                        <OptimizedImage 
                            src={image} 
                            alt={`Gallery image ${idx + 2}`}
                            fill
                            className="transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100 z-20">
                            <Maximize2 className="w-5 h-5 text-white drop-shadow-lg" />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {selectedIndex !== null && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4"
                        onClick={() => setSelectedIndex(null)}
                        onKeyDown={handleKeyDown}
                        tabIndex={0}
                        autoFocus
                    >
                        <Button 
                            variant="ghost" size="icon" 
                            className="absolute top-4 right-4 text-white hover:bg-white/10"
                            onClick={() => setSelectedIndex(null)}
                        >
                            <X className="w-6 h-6" />
                        </Button>

                        <Button
                            variant="ghost" size="icon"
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 hidden md:flex"
                            onClick={handlePrevious}
                        >
                            <ChevronLeft className="w-8 h-8" />
                        </Button>

                        <Button
                            variant="ghost" size="icon"
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 hidden md:flex"
                            onClick={handleNext}
                        >
                            <ChevronRight className="w-8 h-8" />
                        </Button>

                        <div onClick={(e) => e.stopPropagation()}>
                            <motion.img 
                                key={selectedIndex}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                src={images[selectedIndex]} 
                                draggable={false}
                                alt="Gallery preview"
                                className="max-h-[85vh] max-w-[90vw] object-contain shadow-2xl select-none"
                            />
                        </div>

                        {/* Counter */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 text-xs tracking-[0.3em]">
                            {selectedIndex + 1} / {images.length}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}