import React, { useEffect, useState } from 'react';
import { useRecipe } from '../context/RecipeContext';
import RecipeCard from '../components/RecipeCard';
import RecipeDetailModal from '../components/RecipeDetailModal';
import { Bookmark, Search, Filter, Folder, Sparkles, Utensils, Trash2 } from 'lucide-react';

const CUISINES = ['All', 'Italian', 'Indian', 'Mexican', 'Mediterranean', 'Asian', 'French', 'Japanese', 'American'];
const COLLECTIONS = ['All', 'Favorites', 'Quick Dinners', 'Meal Prep', 'High Protein', 'Weekend Cooking'];

export default function BookmarksPage() {
  const { bookmarks, fetchBookmarks, deleteBookmark, loading } = useRecipe();

  const [search, setSearch] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [selectedCollection, setSelectedCollection] = useState('All');

  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchBookmarks({
      search,
      cuisine: selectedCuisine,
      collectionName: selectedCollection,
    });
  }, [fetchBookmarks, search, selectedCuisine, selectedCollection]);

  const handleOpenDetail = (recipe) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  };

  const handleDeleteBookmark = async (id) => {
    if (window.confirm('Are you sure you want to remove this recipe from your saved vault?')) {
      await deleteBookmark(id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-300 text-xs font-semibold mb-2">
            <Bookmark className="w-3.5 h-3.5 fill-orange-400" />
            <span>MongoDB Recipe Vault</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Saved Bookmarks ({bookmarks.length})
          </h1>
          <p className="text-sm text-slate-400">
            Access your saved personalized AI recipes, filter by collection, or start cooking.
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-card p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 border-white/10">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
          <input
            type="text"
            className="glass-input pl-9 text-sm"
            placeholder="Search by title or ingredient..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Cuisine Filter */}
        <div>
          <select
            value={selectedCuisine}
            onChange={(e) => setSelectedCuisine(e.target.value)}
            className="glass-input text-sm cursor-pointer"
          >
            {CUISINES.map((c) => (
              <option key={c} value={c} className="bg-slate-900 text-slate-200">
                {c === 'All' ? 'All Cuisines' : `${c} Cuisine`}
              </option>
            ))}
          </select>
        </div>

        {/* Collection Filter */}
        <div>
          <select
            value={selectedCollection}
            onChange={(e) => setSelectedCollection(e.target.value)}
            className="glass-input text-sm cursor-pointer"
          >
            {COLLECTIONS.map((col) => (
              <option key={col} value={col} className="bg-slate-900 text-slate-200">
                {col === 'All' ? 'All Vault Collections' : `📁 ${col}`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Bookmarks Grid */}
      {loading ? (
        <div className="text-center py-16">
          <div className="w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-400 text-sm">Loading your recipe vault...</p>
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="glass-card p-12 text-center max-w-md mx-auto border-white/10 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mx-auto text-orange-400">
            <Bookmark className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">No Saved Bookmarks Found</h3>
          <p className="text-xs text-slate-400">
            Generate custom recipes in the Studio and save them to your MongoDB vault to access them anytime.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarks.map((recipe) => (
            <RecipeCard
              key={recipe._id}
              recipe={recipe}
              collectionName={recipe.collectionName}
              onOpenDetail={handleOpenDetail}
              onDelete={handleDeleteBookmark}
            />
          ))}
        </div>
      )}

      {/* Recipe Detail Modal */}
      <RecipeDetailModal
        recipe={selectedRecipe}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isBookmarked={true}
      />
    </div>
  );
}
