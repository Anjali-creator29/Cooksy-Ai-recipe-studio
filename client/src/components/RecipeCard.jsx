import React from 'react';
import { Clock, Flame, Bookmark, ChevronRight, Folder } from 'lucide-react';
import RecipeImage from './RecipeImage';
import { getRecipeImageUrl } from '../utils/recipeImage';

export default function RecipeCard({
  recipe,
  onOpenDetail,
  onBookmarkClick,
  isBookmarked = false,
  collectionName,
  onDelete,
}) {
  const imageUrl = getRecipeImageUrl(recipe);

  return (
    <div className="glass-card flex flex-col justify-between overflow-hidden group hover:-translate-y-1 transition-all duration-300 relative border-white/10 hover:border-orange-500/30 hover:shadow-xl hover:shadow-orange-500/10">
      <div>
        {/* Recipe Photo with Floating Badges */}
        <div className="relative overflow-hidden cursor-pointer" onClick={() => onOpenDetail(recipe)}>
          <RecipeImage
            src={imageUrl}
            alt={recipe.title}
            containerClassName="w-full h-44 sm:h-48 relative overflow-hidden"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />

          {/* Top Floating Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-20 pointer-events-none">
            <span className="chip backdrop-blur-md bg-slate-900/80 text-orange-300 border-orange-500/40 text-xs font-semibold shadow-md">
              {recipe.cuisine || 'International'}
            </span>

            {collectionName ? (
              <span className="chip backdrop-blur-md bg-amber-950/80 text-amber-300 border-amber-500/40 text-[11px] flex items-center gap-1 shadow-md">
                <Folder className="w-3 h-3" /> {collectionName}
              </span>
            ) : (
              recipe.difficulty && (
                <span className="text-xs px-2.5 py-1 rounded-full backdrop-blur-md bg-slate-900/80 text-slate-300 border border-white/15 font-medium shadow-md">
                  {recipe.difficulty}
                </span>
              )
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5">
          {/* Title */}
          <h3
            onClick={() => onOpenDetail(recipe)}
            className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors line-clamp-2 mb-2 cursor-pointer"
          >
            {recipe.title}
          </h3>

          {/* Description snippet */}
          {recipe.description && (
            <p className="text-xs text-slate-400 line-clamp-2 mb-3 leading-relaxed">
              {recipe.description}
            </p>
          )}

          {/* Dietary Tags */}
          {recipe.dietaryTags && recipe.dietaryTags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {recipe.dietaryTags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-slate-300 border border-white/10"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Metrics & Action Buttons */}
      <div className="px-5 pb-5 pt-3 border-t border-white/10 bg-slate-950/20">
        <div className="flex items-center justify-between text-xs text-slate-300 mb-3">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-orange-400" />
            {recipe.prepTime || '15m'} + {recipe.cookTime || '20m'}
          </span>
          <span className="flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            {recipe.calories || 450} kcal
          </span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onOpenDetail(recipe)}
            className="btn-primary text-xs py-2 px-3 flex-1 justify-center shadow-md hover:shadow-orange-500/20"
          >
            <span>Cook Now</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          {onBookmarkClick && (
            <button
              onClick={() => onBookmarkClick(recipe)}
              className={`p-2 rounded-xl border transition-all ${
                isBookmarked
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  : 'bg-white/5 hover:bg-white/15 text-slate-300 border-white/10'
              }`}
              title={isBookmarked ? 'Bookmarked' : 'Save to Vault'}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-emerald-400' : ''}`} />
            </button>
          )}

          {onDelete && (
            <button
              onClick={() => onDelete(recipe._id)}
              className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all text-xs"
              title="Delete Bookmark"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
