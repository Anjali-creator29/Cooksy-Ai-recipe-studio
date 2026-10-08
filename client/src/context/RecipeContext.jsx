import React, { createContext, useState, useContext, useCallback } from 'react';
import { useAuth } from './AuthContext';

const RecipeContext = createContext();

export const RecipeProvider = ({ children }) => {
  const { token, user } = useAuth();
  const [generatedRecipe, setGeneratedRecipe] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE = '/api';

  // Generate Personalized Recipe
  const generateRecipe = async (params) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/recipes/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to generate recipe');
      }

      setGeneratedRecipe(data.recipe);
      return data.recipe;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Fetch Bookmarks from MongoDB
  const fetchBookmarks = useCallback(async (filters = {}) => {
    if (!token) return;
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.cuisine) queryParams.append('cuisine', filters.cuisine);
      if (filters.collectionName) queryParams.append('collectionName', filters.collectionName);
      if (filters.dietary) queryParams.append('dietary', filters.dietary);

      const response = await fetch(`${API_BASE}/bookmarks?${queryParams.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (response.ok) {
        setBookmarks(data.bookmarks || []);
      }
    } catch (err) {
      console.error('[RecipeContext] Fetch bookmarks error:', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Save Recipe to Bookmarks
  const saveBookmark = async (recipeData) => {
    if (!token) {
      throw new Error('Please login to bookmark recipes');
    }

    try {
      const response = await fetch(`${API_BASE}/bookmarks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(recipeData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save bookmark');
      }

      setBookmarks((prev) => [data.bookmark, ...prev]);
      return data.bookmark;
    } catch (err) {
      throw err;
    }
  };

  // Update Bookmark
  const updateBookmark = async (id, updatedFields) => {
    if (!token) return;
    try {
      const response = await fetch(`${API_BASE}/bookmarks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedFields),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update bookmark');
      }

      setBookmarks((prev) =>
        prev.map((b) => (b._id === id ? data.bookmark : b))
      );
      return data.bookmark;
    } catch (err) {
      throw err;
    }
  };

  // Delete Bookmark
  const deleteBookmark = async (id) => {
    if (!token) return;
    try {
      const response = await fetch(`${API_BASE}/bookmarks/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete bookmark');
      }

      setBookmarks((prev) => prev.filter((b) => b._id !== id));
      return data;
    } catch (err) {
      throw err;
    }
  };

  return (
    <RecipeContext.Provider
      value={{
        generatedRecipe,
        setGeneratedRecipe,
        bookmarks,
        loading,
        error,
        generateRecipe,
        fetchBookmarks,
        saveBookmark,
        updateBookmark,
        deleteBookmark,
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
};

export const useRecipe = () => useContext(RecipeContext);
