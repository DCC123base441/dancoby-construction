import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { Loader2 } from 'lucide-react';

export default function OptimizedImage({ 
    src, 
    alt, 
    className, 
    width, 
    height, 
    priority = false,
    fill = false,
    ...props 
}) {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        setError(false);
    }, [src]);

    return (
        <div className={cn(
            "relative overflow-hidden bg-slate-100", 
            fill ? "absolute inset-0 w-full h-full" : "",
            className
        )}>
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-200 z-10">
                    <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                </div>
            )}
            
            <img
                src={src}
                alt={alt || ""}
                loading={priority ? "eager" : "lazy"}
                width={width}
                height={height}
                onLoad={() => setIsLoading(false)}
                onError={() => {
                    setIsLoading(false);
                    setError(true);
                }}
                className={cn(
                    "transition-opacity duration-500 ease-in-out",
                    fill ? "absolute inset-0 w-full h-full object-cover" : "",
                    isLoading ? "opacity-0" : "opacity-100",
                    error ? "opacity-0" : "" // Hide broken images or show fallback
                )}
                {...props}
            />
            
            {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-100 text-slate-400 text-xs p-2 text-center">
                    Failed to load
                </div>
            )}
        </div>
    );
}