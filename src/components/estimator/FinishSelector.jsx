import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from "@/components/ui/card";

export default function FinishSelector({ roomType, onSelectFinishes }) {
  const finishOptions = {
    'Kitchen Renovation': [
      { category: 'Countertops', options: ['Budget', 'Standard', 'Premium', 'High-End'] },
      { category: 'Cabinetry', options: ['Stock', 'Semi-Custom', 'Custom', 'High-End'] },
      { category: 'Flooring', options: ['Vinyl', 'Tile', 'Hardwood', 'Premium'] },
      { category: 'Appliances', options: ['Budget', 'Mid-Range', 'Premium', 'Luxury'] }
    ],
    'Bathroom Remodeling': [
      { category: 'Fixtures', options: ['Budget', 'Standard', 'Premium', 'Designer'] },
      { category: 'Tile', options: ['Ceramic', 'Porcelain', 'Natural Stone', 'Luxury'] },
      { category: 'Vanity', options: ['Stock', 'Semi-Custom', 'Custom', 'High-End'] },
      { category: 'Lighting', options: ['Basic', 'Standard', 'Premium', 'Designer'] }
    ],
    'Interior Renovations': [
      { category: 'Paint', options: ['Budget', 'Standard', 'Premium', 'Custom'] },
      { category: 'Flooring', options: ['Vinyl', 'Laminate', 'Hardwood', 'Premium'] },
      { category: 'Hardware', options: ['Basic', 'Standard', 'Premium', 'Designer'] }
    ],
    'Brownstone Restoration': [
      { category: 'Millwork', options: ['Simple', 'Standard', 'Ornate', 'Historical'] },
      { category: 'Flooring', options: ['Engineered', 'Solid Hardwood', 'Premium', 'Reclaimed'] },
      { category: 'Details', options: ['Modern', 'Classic', 'Authentic', 'Custom'] }
    ]
  };

  const options = finishOptions[roomType] || finishOptions['Interior Renovations'];
  const [selectedFinishes, setSelectedFinishes] = useState({});

  const handleSelect = (category, option) => {
    setSelectedFinishes({
      ...selectedFinishes,
      [category]: option
    });
    onSelectFinishes({
      ...selectedFinishes,
      [category]: option
    });
  };

  return (
    <div className="space-y-6">
      {options.map((item, idx) => (
        <motion.div
          key={item.category}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
        >
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            {item.category}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {item.options.map((option) => (
              <button
                key={option}
                onClick={() => handleSelect(item.category, option)}
                className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                  selectedFinishes[item.category] === option
                    ? 'border-red-600 bg-red-50 text-red-900'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}