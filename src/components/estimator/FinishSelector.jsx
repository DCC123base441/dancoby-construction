import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function FinishSelector({ roomType, onSelectFinishes }) {
  const finishOptions = {
    'Kitchen Renovation': [
      { 
        category: 'Countertops', 
        options: [
          { name: 'Laminate', price: '$15-30/sqft' },
          { name: 'Butcher Block', price: '$40-65/sqft' },
          { name: 'Granite', price: '$50-100/sqft' },
          { name: 'Quartz', price: '$75-150/sqft' },
          { name: 'Marble', price: '$100-200/sqft' }
        ]
      },
      { 
        category: 'Cabinetry', 
        options: [
          { name: 'Stock Cabinets', price: '$100-300/lf' },
          { name: 'Semi-Custom', price: '$150-650/lf' },
          { name: 'Custom Cabinets', price: '$500-1200/lf' },
          { name: 'High-End Custom', price: '$1000-2000+/lf' }
        ]
      },
      { 
        category: 'Flooring', 
        options: [
          { name: 'Vinyl Plank', price: '$3-7/sqft' },
          { name: 'Ceramic Tile', price: '$5-15/sqft' },
          { name: 'Porcelain Tile', price: '$8-20/sqft' },
          { name: 'Engineered Hardwood', price: '$8-15/sqft' },
          { name: 'Solid Hardwood', price: '$12-25/sqft' }
        ]
      },
      { 
        category: 'Appliances', 
        options: [
          { name: 'Budget Package', price: '$2,000-4,000' },
          { name: 'Mid-Range Package', price: '$5,000-10,000' },
          { name: 'Premium Package', price: '$12,000-25,000' },
          { name: 'Luxury Package', price: '$30,000-60,000+' }
        ]
      }
    ],
    'Bathroom Remodeling': [
      { 
        category: 'Vanity & Countertop', 
        options: [
          { name: 'Prefab Vanity', price: '$200-600' },
          { name: 'Semi-Custom Vanity', price: '$800-2,000' },
          { name: 'Custom Vanity + Quartz', price: '$2,500-5,000' },
          { name: 'Custom + Marble Top', price: '$5,000-10,000+' }
        ]
      },
      { 
        category: 'Tile (Floors & Walls)', 
        options: [
          { name: 'Ceramic Tile', price: '$5-15/sqft' },
          { name: 'Porcelain Tile', price: '$8-25/sqft' },
          { name: 'Natural Stone', price: '$15-40/sqft' },
          { name: 'Large Format/Custom', price: '$25-60/sqft' }
        ]
      },
      { 
        category: 'Fixtures', 
        options: [
          { name: 'Builder Grade', price: '$300-800' },
          { name: 'Mid-Range', price: '$1,000-2,500' },
          { name: 'Premium', price: '$3,000-6,000' },
          { name: 'Designer/Luxury', price: '$8,000-15,000+' }
        ]
      },
      { 
        category: 'Shower/Tub', 
        options: [
          { name: 'Prefab Shower', price: '$500-1,500' },
          { name: 'Tile Shower', price: '$2,500-5,000' },
          { name: 'Custom Tile Shower', price: '$5,000-10,000' },
          { name: 'Frameless Glass + Custom', price: '$10,000-20,000+' }
        ]
      }
    ],
    'Whole Home Renovation': [
      { 
        category: 'Flooring', 
        options: [
          { name: 'Luxury Vinyl Plank', price: '$4-8/sqft' },
          { name: 'Engineered Hardwood', price: '$8-15/sqft' },
          { name: 'Solid Hardwood', price: '$12-22/sqft' },
          { name: 'Premium Wide Plank', price: '$18-35/sqft' }
        ]
      },
      { 
        category: 'Paint & Finishes', 
        options: [
          { name: 'Standard Paint', price: '$2-4/sqft' },
          { name: 'Premium Paint', price: '$4-6/sqft' },
          { name: 'Designer Colors + Trim', price: '$6-10/sqft' },
          { name: 'Custom Finishes + Wallpaper', price: '$10-20+/sqft' }
        ]
      },
      { 
        category: 'Lighting', 
        options: [
          { name: 'Basic Fixtures', price: '$1,500-3,000' },
          { name: 'Mid-Range Fixtures', price: '$4,000-8,000' },
          { name: 'Designer Fixtures', price: '$10,000-20,000' },
          { name: 'Custom/Luxury', price: '$25,000-50,000+' }
        ]
      },
      { 
        category: 'Trim & Millwork', 
        options: [
          { name: 'Standard Trim', price: '$3-6/lf' },
          { name: 'Crown Molding + Baseboards', price: '$8-15/lf' },
          { name: 'Custom Millwork', price: '$15-30/lf' },
          { name: 'Ornate/Historical', price: '$30-60+/lf' }
        ]
      }
    ],
    'Basement Remodel': [
      { 
        category: 'Flooring', 
        options: [
          { name: 'Epoxy Coating', price: '$3-7/sqft' },
          { name: 'Luxury Vinyl Tile', price: '$4-8/sqft' },
          { name: 'Engineered Hardwood', price: '$8-14/sqft' },
          { name: 'Polished Concrete', price: '$5-12/sqft' }
        ]
      },
      { 
        category: 'Walls & Ceiling', 
        options: [
          { name: 'Basic Drywall', price: '$2-4/sqft' },
          { name: 'Drywall + Insulation', price: '$4-7/sqft' },
          { name: 'Drop Ceiling', price: '$3-6/sqft' },
          { name: 'Custom Ceiling + Soundproofing', price: '$8-15/sqft' }
        ]
      },
      { 
        category: 'Bathroom Addition', 
        options: [
          { name: 'Half Bath Basic', price: '$5,000-10,000' },
          { name: 'Half Bath Mid-Range', price: '$10,000-18,000' },
          { name: 'Full Bath Standard', price: '$15,000-25,000' },
          { name: 'Full Bath Premium', price: '$25,000-40,000+' }
        ]
      }
    ],
    'Brownstone Restoration': [
      { 
        category: 'Flooring', 
        options: [
          { name: 'Refinish Existing', price: '$4-8/sqft' },
          { name: 'Engineered Hardwood', price: '$10-18/sqft' },
          { name: 'Solid Hardwood', price: '$15-28/sqft' },
          { name: 'Reclaimed/Antique', price: '$25-50/sqft' }
        ]
      },
      { 
        category: 'Millwork & Trim', 
        options: [
          { name: 'Simple Restoration', price: '$12-20/lf' },
          { name: 'Period-Accurate', price: '$25-45/lf' },
          { name: 'Custom Ornate', price: '$50-90/lf' },
          { name: 'Historical Replication', price: '$100-200+/lf' }
        ]
      },
      { 
        category: 'Windows & Doors', 
        options: [
          { name: 'Standard Replacement', price: '$500-1,000/unit' },
          { name: 'Wood Clad', price: '$1,000-2,000/unit' },
          { name: 'Custom Wood', price: '$2,000-4,000/unit' },
          { name: 'Historical Restoration', price: '$4,000-8,000+/unit' }
        ]
      },
      { 
        category: 'Facade Work', 
        options: [
          { name: 'Basic Repointing', price: '$15-25/sqft' },
          { name: 'Full Repointing + Repair', price: '$30-50/sqft' },
          { name: 'Brownstone Patching', price: '$50-80/sqft' },
          { name: 'Full Facade Restoration', price: '$80-150+/sqft' }
        ]
      }
    ],
    'Addition/Extension': [
      { 
        category: 'Foundation & Structure', 
        options: [
          { name: 'Basic Slab', price: '$15-25/sqft' },
          { name: 'Crawl Space', price: '$20-35/sqft' },
          { name: 'Full Basement', price: '$40-70/sqft' },
          { name: 'Complex/Underpinning', price: '$80-150/sqft' }
        ]
      },
      { 
        category: 'Exterior Finish', 
        options: [
          { name: 'Vinyl Siding', price: '$8-15/sqft' },
          { name: 'Fiber Cement', price: '$12-22/sqft' },
          { name: 'Brick Veneer', price: '$20-35/sqft' },
          { name: 'Stone/Custom', price: '$35-60+/sqft' }
        ]
      },
      { 
        category: 'Interior Finish Level', 
        options: [
          { name: 'Builder Grade', price: '$80-120/sqft' },
          { name: 'Mid-Range', price: '$150-220/sqft' },
          { name: 'High-End', price: '$250-350/sqft' },
          { name: 'Luxury', price: '$400-600+/sqft' }
        ]
      }
    ]
  };

  const options = finishOptions[roomType] || finishOptions['Whole Home Renovation'];
  const [selectedFinishes, setSelectedFinishes] = useState({});

  const handleSelect = (category, optionName) => {
    const newSelections = {
      ...selectedFinishes,
      [category]: optionName
    };
    setSelectedFinishes(newSelections);
    onSelectFinishes(newSelections);
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {item.options.map((option) => (
              <button
                key={option.name}
                onClick={() => handleSelect(item.category, option.name)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  selectedFinishes[item.category] === option.name
                    ? 'border-red-600 bg-red-50'
                    : 'border-gray-200 bg-white hover:border-gray-400'
                }`}
              >
                <div className="font-medium text-gray-900">{option.name}</div>
                <div className="text-sm text-gray-500 mt-1">{option.price}</div>
              </button>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}