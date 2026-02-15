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
    <div className="mb-14 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
      {/* Category pills */}
      <div className="flex items-center gap-1 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => handleCategoryChange(cat.value)}
            className={`relative px-4 py-2 text-xs uppercase tracking-[0.2em] font-medium transition-colors duration-300 rounded-full
              ${selectedCategory === cat.value
                ? 'text-white bg-stone-900'
                : 'text-stone-500 hover:text-stone-900 bg-transparent hover:bg-stone-100'
              }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Count indicator */}
      <p className="text-xs text-stone-400 tracking-wide hidden sm:block">
        Filter by type
      </p>
    </div>
  );
}