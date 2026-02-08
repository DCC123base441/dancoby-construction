import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';

export default function BrandPartnersSection() {
    const { data: brands = [] } = useQuery({
        queryKey: ['brandPartners'],
        queryFn: () => base44.entities.BrandPartner.list('order'),
    });

    const activeBrands = brands.filter(b => b.isActive);

    if (activeBrands.length === 0) return null;

    return (
        <section className="py-16 md:py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <p className="text-xs tracking-[2px] text-[#a39e96] uppercase mb-4">Our Partners</p>
                    <h2 className="text-3xl md:text-4xl font-light text-gray-900">Brands We Work With</h2>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="flex flex-wrap items-center justify-center gap-10 md:gap-16"
                >
                    {activeBrands.map((brand, idx) => (
                        <motion.div
                            key={brand.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: idx * 0.05 }}
                            className="grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300 flex items-center justify-center"
                            style={{ width: 160, height: 60 }}
                        >
                            {brand.websiteUrl ? (
                                <a href={brand.websiteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full h-full">
                                    <img
                                        src={brand.logoUrl}
                                        alt={brand.name}
                                        className="max-h-[40px] md:max-h-[50px] max-w-[140px] w-auto object-contain"
                                        loading="lazy"
                                        onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = `<span class="text-lg font-semibold tracking-wide text-gray-400">${brand.name}</span>`; }}
                                    />
                                </a>
                            ) : (
                                <img
                                    src={brand.logoUrl}
                                    alt={brand.name}
                                    className="max-h-[40px] md:max-h-[50px] max-w-[140px] w-auto object-contain"
                                    loading="lazy"
                                    onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = `<span class="text-lg font-semibold tracking-wide text-gray-400">${brand.name}</span>`; }}
                                />
                            )}
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}