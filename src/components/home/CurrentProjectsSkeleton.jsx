import React from 'react';

export default function CurrentProjectsSkeleton() {
  return (
    <div className="grid md:grid-cols-2 gap-12 mb-16">
      {[0, 1].map((idx) => (
        <div key={idx} className="animate-pulse">
          <div className="relative mb-6 bg-gray-200 aspect-[4/3] rounded-sm" />
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
          <div className="h-4 bg-gray-200 rounded w-full mb-2" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
        </div>
      ))}
    </div>
  );
}