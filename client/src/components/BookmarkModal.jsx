import React, { useState } from 'react';
import { Bookmark, X, FolderPlus, FileText, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useRecipe } from '../context/RecipeContext';

const DEFAULT_COLLECTIONS = ['Favorites', 'Quick Dinners', 'Meal Prep', 'High Protein', 'Weekend Cooking'];

export default function BookmarkModal({ recipe, isOpen, onClose, onSaved }) {
  const { saveBookmark } = useRecipe();
  const [collectionName, setCollectionName] = useState('Favorites');
  const [customCollection, setCustomCollection] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !recipe) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');

    const targetCollection = customCollection.trim() || collectionName;

    try {
      const savedObj = await saveBookmark({
        ...recipe,
        collectionName: targetCollection,
        notes,
      });

      if (onSaved) onSaved(savedObj);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save bookmark.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="glass-card w-full max-w-md p-6 relative border-orange-500/30 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
            <Bookmark className="w-5 h-5 fill-orange-400/20" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Save Recipe to Vault</h3>
            <p className="text-xs text-slate-400 line-clamp-1">{recipe.title}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <FolderPlus className="w-3.5 h-3.5 text-orange-400" /> Select Vault Collection
            </label>
            <div className="grid grid-cols-2 gap-2 mb-2">
              {DEFAULT_COLLECTIONS.map((col) => (
                <button
                  key={col}
                  type="button"
                  onClick={() => {
                    setCollectionName(col);
                    setCustomCollection('');
                  }}
                  className={`text-xs py-2 px-3 rounded-lg border text-left font-medium transition-all ${
                    collectionName === col && !customCollection
                      ? 'bg-orange-500/20 text-orange-300 border-orange-500/50'
                      : 'bg-white/5 text-slate-400 border-white/10 hover:text-slate-200'
                  }`}
                >
                  {col}
                </button>
              ))}
            </div>

            <input
              type="text"
              className="glass-input text-xs"
              placeholder="Or type a custom collection name..."
              value={customCollection}
              onChange={(e) => setCustomCollection(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-orange-400" /> Personal Cooking Notes (Optional)
            </label>
            <textarea
              rows={3}
              className="glass-input text-xs resize-none"
              placeholder="Add tips, extra spices, or dietary adjustments for next time..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {errorMsg && (
            <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary text-xs flex-1">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary text-xs flex-1 py-2.5">
              {saving ? 'Saving to Vault...' : 'Save to Bookmarks'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
