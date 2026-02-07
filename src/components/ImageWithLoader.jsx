import React, { useState } from 'react';
import { cn } from "@/lib/utils";

export default function ImageWithLoader({ 
  src, 
  alt, 
  className = '', 
  containerClassName = '',
  ...props 
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={cn("relative overflow-hidden", containerClassName)}>
      {/* Skeleton placeholder */}
      {!isLoaded && !hasError && (
        <div className={cn("absolute inset-0 bg-gray-200", className)}>
          <div 
            className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse"
          />
        </div>
      )}
      
      {/* Actual image */}
      <img
        src={src}
        alt={alt}
        className={cn(
          className,
          "transition-opacity duration-500",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        loading="lazy"
        {...props}
      />

      {/* Error state */}
      {hasError && (
        <div className={cn("absolute inset-0 bg-gray-100 flex items-center justify-center", className)}>
          <span className="text-gray-400 text-sm">Image unavailable</span>
        </div>
      )}
    </div>
  );
}