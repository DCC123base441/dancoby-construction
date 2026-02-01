import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import OptimizedImage from "@/components/ui/OptimizedImage";

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

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Project Gallery</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((image, idx) => (
                    <motion.div 
                        key={idx}
                        layoutId={`gallery-image-${idx}`}
                        className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg bg-gray-100"
                        onClick={() => setSelectedIndex(idx)}
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                    >
                        <OptimizedImage 
                            src={image} 
                            alt={`Gallery image ${idx + 1}`}
                            fill
                            className="transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 z-20">
                            <Maximize2 className="w-6 h-6 text-white drop-shadow-md" />
                        </div>
                    </motion.div>
                ))}
            </div>

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
                            variant="ghost" 
                            size="icon" 
                            className="absolute top-4 right-4 text-white hover:bg-white/10"
                            onClick={() => setSelectedIndex(null)}
                        >
                            <X className="w-6 h-6" />
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 hidden md:flex"
                            onClick={handlePrevious}
                        >
                            <ChevronLeft className="w-8 h-8" />
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 hidden md:flex"
                            onClick={handleNext}
                        >
                            <ChevronRight className="w-8 h-8" />
                        </Button>

                        <div 
                            className="relative max-h-full max-w-full overflow-hidden rounded-lg"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <motion.img 
                                layoutId={`gallery-image-${selectedIndex}`}
                                src={images[selectedIndex]} 
                                alt="Gallery preview"
                                className="max-h-[85vh] max-w-[90vw] object-contain shadow-2xl"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}