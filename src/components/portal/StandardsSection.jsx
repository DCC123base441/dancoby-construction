import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Loader2, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useLanguage } from './LanguageContext';

export default function StandardsSection() {
  const { t } = useLanguage();
  const [filterCategory, setFilterCategory] = useState('all');
  const [expandedImage, setExpandedImage] = useState(null);

  const { data: standards = [], isLoading } = useQuery({
    queryKey: ['standards'],
    queryFn: () => base44.entities.Standard.list('order'),
  });

  const categories = [...new Set(standards.map(s => s.category).filter(Boolean))];
  const filtered = filterCategory === 'all' ? standards : standards.filter(s => s.category === filterCategory);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
      </div>
    );
  }

  if (standards.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-sm">{t('noStandards')}</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-1">{t('companyStandards')}</h2>
      <p className="text-sm text-gray-500 mb-4">{t('standardsDesc')}</p>

      {categories.length > 0 && (
        <div className="flex gap-2 mb-4 flex-wrap">
          <Button size="sm" variant={filterCategory === 'all' ? 'default' : 'outline'} onClick={() => setFilterCategory('all')}>{t('allFilter')}</Button>
          {categories.map(cat => (
            <Button key={cat} size="sm" variant={filterCategory === cat ? 'default' : 'outline'} onClick={() => setFilterCategory(cat)}>{cat}</Button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <div key={item.id} className="rounded-xl overflow-hidden border border-gray-200 bg-white cursor-pointer active:scale-[0.98] transition-transform" onClick={() => setExpandedImage(item)}>
            <div className="relative">
              <img src={item.imageUrl} alt={item.note} loading="lazy" className="w-full h-48 object-cover" />
              <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-sm font-bold shadow-lg ${
                item.note === 'This' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
              }`}>
                {item.note === 'This' ? '✅' : '❌'} {item.note}
              </div>
            </div>
            {item.category && (
              <div className="px-3 py-2 border-t border-gray-100">
                <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">{item.category}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Fullscreen image viewer */}
      {expandedImage && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setExpandedImage(null)}>
          <button className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2" onClick={() => setExpandedImage(null)}>
            <X className="w-6 h-6" />
          </button>
          <div className="relative max-w-full max-h-full" onClick={(e) => e.stopPropagation()}>
            <img src={expandedImage.imageUrl} alt={expandedImage.note} className="max-w-full max-h-[85vh] object-contain rounded-lg" />
            <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-sm font-bold shadow-lg ${
              expandedImage.note === 'This' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            }`}>
              {expandedImage.note === 'This' ? '✅' : '❌'} {expandedImage.note}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}