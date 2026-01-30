import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from 'lucide-react';

export default function ProjectFilters({ onFilterChange, onSortChange }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSort, setSelectedSort] = useState('recent');

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    onFilterChange(value);
  };

  const handleSortChange = (value) => {
    setSelectedSort(value);
    onSortChange(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-12 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
    >
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-600" />
          <span className="text-xs uppercase tracking-widest text-gray-600 font-medium">Category</span>
        </div>
        <Select value={selectedCategory} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-48 border-gray-300 text-xs uppercase tracking-wide">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            <SelectItem value="Residential">Residential</SelectItem>
            <SelectItem value="Commercial">Commercial</SelectItem>
            <SelectItem value="Renovation">Renovation</SelectItem>
            <SelectItem value="Restoration">Restoration</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-xs uppercase tracking-widest text-gray-600 font-medium">Sort By</span>
        <Select value={selectedSort} onValueChange={handleSortChange}>
          <SelectTrigger className="w-48 border-gray-300 text-xs uppercase tracking-wide">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="name-asc">Name (A-Z)</SelectItem>
            <SelectItem value="name-desc">Name (Z-A)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </motion.div>
  );
}