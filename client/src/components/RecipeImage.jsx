import React, { useState } from 'react';
import { Utensils } from 'lucide-react';
import { FALLBACK_FOOD_IMAGE } from '../utils/recipeImage';

export default function RecipeImage({
  src,
  alt = 'Recipe photo',
  className = 'w-full h-full object-cover',
  containerClassName = 'w-full h-48 relative overflow-hidden',
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const imgSrc = error || !src ? FALLBACK_FOOD_IMAGE : src;

  return (
    <div className={`relative bg-slate-900/80 overflow-hidden ${containerClassName}`}>
      {/* Loading Skeleton Shimmer */}
      {!loaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900 animate-pulse z-10">
          <div className="flex flex-col items-center gap-2 text-slate-600">
            <Utensils className="w-8 h-8 animate-bounce opacity-40" />
            <span className="text-[10px] tracking-wider uppercase font-semibold text-slate-500">
              Loading preview...
            </span>
          </div>
        </div>
      )}

      {/* Actual Food Image */}
      <img
        src={imgSrc}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => {
          if (!error) {
            setError(true);
            setLoaded(true);
          }
        }}
        className={`${className} transition-all duration-700 ease-out ${
          loaded ? 'opacity-100 scale-100 filter-none' : 'opacity-0 scale-105 blur-sm'
        }`}
      />

      {/* Subtle Gradient Scrim for readable badges */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20 pointer-events-none" />
    </div>
  );
}
