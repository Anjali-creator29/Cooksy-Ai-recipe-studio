import React from 'react';
import { Clock, Flame, ChefHat, Bookmark, ChevronRight, Sparkles, Folder } from 'lucide-react';

export default function RecipeCard({
  recipe,
  onOpenDetail,
  onBookmarkClick,
  isBookmarked = false,
  collectionName,
  onDelete,
}) {
  return (
    <div className="glass-card flex flex-col justify-between p-5 group hover:-translate-y-1 transition-all duration-300 relative">
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="chip chip-active text-xs">
            {recipe.cuisine || 'International'}
          </span>

          {collectionName ? (
            <span className="chip bg-amber-500/10 text-amber-300 border-amber-500/30 text-[11px] flex items-center gap-1">
              <Folder className="w-3 h-3" /> {collectionName}
            </span>
          ) : (
            recipe.difficulty && (
              <span className="text-xs text-slate-400 font-medium">
                {recipe.difficulty}
              </span>
            )
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors line-clamp-2 mb-2">
          {recipe.title}
        </h3>

        {/* Description snippet */}
        {recipe.description && (
          <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
            {recipe.description}
          </p>
        )}

        {/* Dietary Tags */}
        {recipe.dietaryTags && recipe.dietaryTags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {recipe.dietaryTags.map((tag) => (
              <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-slate-300 border border-white/10">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Metrics & Action Buttons */}
      <div className="pt-3 border-t border-white/10">
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
            className="btn-primary text-xs py-2 px-3 flex-1 justify-center"
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
