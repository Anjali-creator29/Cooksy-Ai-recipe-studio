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

  // Safe JSON API fetcher that handles non-JSON / serverless error pages gracefully
  const safeFetchJson = async (url, options = {}) => {
    let response;
    try {
      response = await fetch(url, options);
    } catch (networkErr) {
      throw new Error(`Network error: ${networkErr.message}. Please check your internet connection.`);
    }

    const contentType = response.headers.get('content-type') || '';
    let data = null;

    if (contentType.includes('application/json')) {
      try {
        data = await response.json();
      } catch {
        throw new Error('Malformed response received from server.');
      }
    } else {
      const text = await response.text();
      const cleanText = text.replace(/<[^>]*>?/gm, '').trim();
      throw new Error(cleanText || `Server error (${response.status})`);
    }

    if (!response.ok) {
      throw new Error(data?.message || `Request failed with status ${response.status}`);
    }

    return data;
  };

  // Generate Personalized Recipe
  const generateRecipe = async (params) => {
    setLoading(true);
    setError(null);
    try {
      const data = await safeFetchJson(`${API_BASE}/recipes/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

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

      const data = await safeFetchJson(`${API_BASE}/bookmarks?${queryParams.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBookmarks(data.bookmarks || []);
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
      const data = await safeFetchJson(`${API_BASE}/bookmarks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(recipeData),
      });

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
      const data = await safeFetchJson(`${API_BASE}/bookmarks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedFields),
      });

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
      const data = await safeFetchJson(`${API_BASE}/bookmarks/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

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
