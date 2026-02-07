import { cn } from "@/lib/utils";

export function Skeleton({ className }) {
  return (
    <div className={cn("animate-pulse bg-gray-200 rounded", className)} />
  );
}

export function ProjectCardSkeleton() {
  return (
    <div className="group">
      <Skeleton className="aspect-[4/3] w-full rounded-lg mb-4" />
      <Skeleton className="h-4 w-20 mb-2" />
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-full mb-1" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}

export function TestimonialSkeleton() {
  return (
    <div className="p-8 bg-white rounded-xl">
      <Skeleton className="h-6 w-32 mb-4" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-3/4 mb-6" />
      <div className="flex items-center gap-3">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div>
          <Skeleton className="h-4 w-24 mb-1" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  );
}

export function ServiceCardSkeleton() {
  return (
    <div>
      <Skeleton className="aspect-[4/3] w-full mb-8" />
      <Skeleton className="h-8 w-3/4 mb-4" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-2/3 mb-6" />
      <Skeleton className="h-12 w-full" />
    </div>
  );
}

export function ImageSkeleton({ className }) {
  return (
    <div className={cn("relative overflow-hidden bg-gray-200", className)}>
      <div 
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent" 
        style={{
          animation: 'shimmer 1.5s infinite',
          transform: 'translateX(-100%)'
        }}
      />
    </div>
  );
}