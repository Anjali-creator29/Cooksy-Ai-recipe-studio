import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('cooksy_token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Configure global API base URL
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
      // Clean up HTML error tags if returned by hosting platform
      const cleanText = text.replace(/<[^>]*>?/gm, '').trim();
      throw new Error(cleanText || `Server error (${response.status})`);
    }

    if (!response.ok) {
      throw new Error(data?.message || `Request failed with status ${response.status}`);
    }

    return data;
  };

  // Fetch current user on mount if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await safeFetchJson(`${API_BASE}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(data.user);
      } catch (err) {
        console.error('[Auth Context] Fetch user error:', err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  // Register function
  const register = async (name, email, password, dietaryPreferences = [], favoriteCuisines = []) => {
    setError(null);
    try {
      const data = await safeFetchJson(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, dietaryPreferences, favoriteCuisines }),
      });

      localStorage.setItem('cooksy_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Login function
  const login = async (email, password) => {
    setError(null);
    try {
      const data = await safeFetchJson(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      localStorage.setItem('cooksy_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('cooksy_token');
    setToken(null);
    setUser(null);
  };

  // Update profile function
  const updateProfile = async (profileData) => {
    setError(null);
    try {
      const data = await safeFetchJson(`${API_BASE}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      setUser(data.user);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Request password reset function
  const requestPasswordReset = async (email) => {
    setError(null);
    try {
      return await safeFetchJson(`${API_BASE}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Reset password using token
  const resetPassword = async (resetToken, password) => {
    setError(null);
    try {
      const data = await safeFetchJson(`${API_BASE}/auth/reset-password/${resetToken}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      localStorage.setItem('cooksy_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        register,
        login,
        logout,
        updateProfile,
        requestPasswordReset,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
