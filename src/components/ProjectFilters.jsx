import React, { useState } from 'react';
import { motion } from 'framer-motion';

const CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'Residential', label: 'Residential' },
  { value: 'Commercial', label: 'Commercial' },
  { value: 'Renovation', label: 'Renovation' },
  { value: 'Restoration', label: 'Restoration' },
];

export default function ProjectFilters({ onFilterChange, onSortChange }) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    onFilterChange(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mb-14 flex items-center justify-center"
    >
      <div className="flex items-center gap-1 border-b border-stone-200">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => handleCategoryChange(cat.value)}
            className={`relative px-5 py-3 text-[12px] uppercase tracking-[0.2em] font-medium transition-colors duration-300
              ${selectedCategory === cat.value
                ? 'text-stone-900'
                : 'text-stone-400 hover:text-stone-600'
              }`}
          >
            {cat.label}
            {selectedCategory === cat.value && (
              <motion.div
                layoutId="filter-underline"
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-stone-900"
                transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
              />
            )}
          </button>
        ))}
      </div>
    </motion.div>
  );
}