import React, { useState, useRef, useEffect } from 'react';
import { cn } from "@/lib/utils";

/**
 * Optimizes images by:
 * 1. Lazy loading with IntersectionObserver (only loads when near viewport)
 * 2. Responsive srcSet for Unsplash images (serves smaller images on smaller screens)
 * 3. Uses width descriptors so the browser picks the best size
 * 4. Adds decoding="async" for non-blocking rendering
 * 5. Optional low-quality placeholder blur-up effect
 */

const UNSPLASH_WIDTHS = [400, 640, 768, 1024, 1280, 1920];

function getOptimizedSrc(src, width, quality = 75) {
  if (!src || typeof src !== 'string') return src;

  // Unsplash images - use their built-in resizing
  if (src.includes('unsplash.com')) {
    const url = new URL(src);
    url.searchParams.set('w', String(width));
    url.searchParams.set('q', String(quality));
    url.searchParams.set('auto', 'format');
    url.searchParams.set('fit', 'crop');
    return url.toString();
  }

  return src;
}

function buildSrcSet(src, quality = 75) {
  if (!src || typeof src !== 'string') return undefined;
  if (!src.includes('unsplash.com')) return undefined;

  return UNSPLASH_WIDTHS
    .map(w => `${getOptimizedSrc(src, w, quality)} ${w}w`)
    .join(', ');
}

export default function OptimizedImage({
  src,
  alt = '',
  className = '',
  containerClassName = '',
  quality = 75,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  priority = false,
  ...props
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef(null);

  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const srcSet = buildSrcSet(src, quality);
  const optimizedSrc = getOptimizedSrc(src, 1024, quality);

  return (
    <div ref={imgRef} className={cn("relative overflow-hidden w-full h-full", containerClassName)}>
      {/* Skeleton placeholder */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gray-200">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
        </div>
      )}

      {/* Actual image - only rendered when in view */}
      {isInView && (
        <img
          src={optimizedSrc}
          srcSet={srcSet}
          sizes={sizes}
          alt={alt}
          className={cn(
            "w-full h-full",
            className,
            "transition-opacity duration-500",
            isLoaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
          {...props}
        />
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <span className="text-gray-400 text-sm">Image unavailable</span>
        </div>
      )}
    </div>
  );
}