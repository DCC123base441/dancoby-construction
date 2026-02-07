import React from 'react';

export default function FeaturedProjectsSkeleton() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
      {[0, 1, 2, 3].map((idx) => (
        <div key={idx} className="animate-pulse">
          <div className="bg-gray-200 h-96 mb-6 rounded-sm" />
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
          <div className="h-5 bg-gray-200 rounded w-full mb-2" />
          <div className="h-5 bg-gray-200 rounded w-3/4 mb-4" />
          <div className="h-9 bg-gray-200 rounded w-28" />
        </div>
      ))}
    </div>
  );
}