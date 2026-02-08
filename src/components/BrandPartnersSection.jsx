import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';

const BRAND_STYLES = {
    'Kohler': { fontFamily: "'Georgia', serif", fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', fontSize: '1.1rem' },
    'Duravit': { fontFamily: "'Georgia', serif", fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', fontSize: '1.1rem' },
    'Waterworks': { fontFamily: "'Georgia', serif", fontWeight: 400, letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: '0.85rem' },
    'Grohe': { fontFamily: "'Arial', sans-serif", fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: '1.2rem' },
    'TOTO': { fontFamily: "'Arial', sans-serif", fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', fontSize: '1.3rem' },
    'Ruvati': { fontFamily: "'Georgia', serif", fontWeight: 400, letterSpacing: '0.18em', textTransform: 'uppercase', fontSize: '1rem' },
    'Benjamin Moore': { fontFamily: "'Georgia', serif", fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', fontSize: '0.8rem' },
    'JobTread': { fontFamily: "'Arial', sans-serif", fontWeight: 700, letterSpacing: '0.05em', textTransform: 'none', fontSize: '1.1rem' },
    'Signature Hardware': { fontFamily: "'Georgia', serif", fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: '0.75rem' },
};

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
                    className="flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-16"
                >
                    {activeBrands.map((brand, idx) => {
                        const style = BRAND_STYLES[brand.name] || { fontFamily: "'Georgia', serif", fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '1rem' };
                        const content = (
                            <span 
                                className="text-gray-800 hover:text-gray-950 transition-colors duration-300 whitespace-nowrap select-none"
                                style={style}
                            >
                                {brand.name}
                            </span>
                        );
                        return (
                            <motion.div
                                key={brand.id}
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: idx * 0.06 }}
                                className="opacity-40 hover:opacity-100 transition-all duration-300 flex items-center justify-center py-2"
                            >
                                {brand.websiteUrl ? (
                                    <a href={brand.websiteUrl} target="_blank" rel="noopener noreferrer">
                                        {content}
                                    </a>
                                ) : content}
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}