import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function FinishSelector({ roomType, onFinishesChange }) {
  const finishCategories = {
    Kitchen: ['Countertops', 'Flooring', 'Cabinetry', 'Backsplash', 'Fixtures', 'Paint'],
    Bathroom: ['Countertops', 'Flooring', 'Tile', 'Fixtures', 'Cabinetry', 'Paint'],
    Bedroom: ['Flooring', 'Paint', 'Hardware', 'Fixtures'],
    'Living Room': ['Flooring', 'Paint', 'Hardware'],
    'Full House': ['Flooring', 'Countertops', 'Paint', 'Fixtures']
  };

  const finishOptions = {
    Countertops: ['Granite', 'Quartz', 'Marble', 'Laminate', 'Butcher Block'],
    Flooring: ['Hardwood', 'Tile', 'Vinyl', 'Laminate', 'Marble'],
    Cabinetry: ['White Shaker', 'Dark Walnut', 'Light Oak', 'Custom', 'Two-Tone'],
    Backsplash: ['Subway Tile', 'Mosaic', 'Marble', 'Hexagon', 'None'],
    Fixtures: ['Chrome', 'Brushed Nickel', 'Matte Black', 'Gold', 'Stainless Steel'],
    Paint: ['Soft White', 'Warm Gray', 'Navy Blue', 'Sage Green', 'Classic Beige'],
    Tile: ['White Subway', 'Carrara Marble', 'Hexagon', 'Large Format', 'Mosaic'],
    Hardware: ['Modern', 'Traditional', 'Industrial', 'Vintage']
  };

  const [finishes, setFinishes] = useState({});

  const handleFinishChange = (category, value) => {
    const updated = { ...finishes, [category]: value };
    setFinishes(updated);
    onFinishesChange(updated);
  };

  const categories = finishCategories[roomType] || [];

  return (
    <div className="space-y-6">
      {categories.map((category) => (
        <Card key={category} className="p-6">
          <label className="block text-sm font-semibold text-gray-900 mb-4">
            {category}
          </label>
          <Select value={finishes[category] || ''} onValueChange={(value) => handleFinishChange(category, value)}>
            <SelectTrigger>
              <SelectValue placeholder={`Choose ${category.toLowerCase()}...`} />
            </SelectTrigger>
            <SelectContent>
              {(finishOptions[category] || []).map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Card>
      ))}

      <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-900">
          <strong>💡 Tip:</strong> Mix and match styles! Our AI will blend your selections for a cohesive renovation vision.
        </p>
      </div>
    </div>
  );
}