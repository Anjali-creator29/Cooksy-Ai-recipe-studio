import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, ShieldCheck, ChefHat, Lock, Save, CheckCircle2, ShieldAlert } from 'lucide-react';

const DIETARY_OPTIONS = ['Vegan', 'Vegetarian', 'Gluten-Free', 'Keto', 'Dairy-Free', 'Low-Carb', 'Nut-Free', 'Halal', 'Kosher'];
const CUISINES = ['Italian', 'Indian', 'Mexican', 'Mediterranean', 'Asian', 'French', 'Japanese', 'American'];

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [dietaryPreferences, setDietaryPreferences] = useState(user?.dietaryPreferences || []);
  const [favoriteCuisines, setFavoriteCuisines] = useState(user?.favoriteCuisines || []);
  const [newPassword, setNewPassword] = useState('');

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const toggleDietary = (item) => {
    if (dietaryPreferences.includes(item)) {
      setDietaryPreferences(dietaryPreferences.filter((d) => d !== item));
    } else {
      setDietaryPreferences([...dietaryPreferences, item]);
    }
  };

  const toggleCuisine = (item) => {
    if (favoriteCuisines.includes(item)) {
      setFavoriteCuisines(favoriteCuisines.filter((c) => c !== item));
    } else {
      setFavoriteCuisines([...favoriteCuisines, item]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const updatePayload = {
        name,
        dietaryPreferences,
        favoriteCuisines,
      };

      if (newPassword) {
        if (newPassword.length < 6) {
          throw new Error('New password must be at least 6 characters');
        }
        updatePayload.password = newPassword;
      }

      await updateProfile(updatePayload);
      setSuccessMsg('Profile and preferences updated successfully!');
      setNewPassword('');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center gap-4 border-b border-white/10 pb-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-orange-500/20">
          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">{user?.name} Profile Studio</h1>
          <p className="text-xs text-slate-400">{user?.email} • JWT Protected Account</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="glass-card p-6 md:p-8 space-y-6 border-white/10">
        {/* Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Display Name</label>
          <input
            type="text"
            className="glass-input text-sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Dietary Preferences */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">
            Default Dietary Restrictions
          </label>
          <div className="flex flex-wrap gap-2">
            {DIETARY_OPTIONS.map((d) => {
              const active = dietaryPreferences.includes(d);
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => toggleDietary(d)}
                  className={`chip chip-selectable text-xs ${
                    active ? 'chip-active' : 'bg-white/5 text-slate-300 border-white/10'
                  }`}
                >
                  {active ? '✓ ' : '+ '}
                  {d}
                </button>
              );
            })}
          </div>
        </div>

        {/* Favorite Cuisines */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">
            Favorite Cuisines
          </label>
          <div className="flex flex-wrap gap-2">
            {CUISINES.map((c) => {
              const active = favoriteCuisines.includes(c);
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => toggleCuisine(c)}
                  className={`text-xs px-3 py-1.5 rounded-xl border transition-all ${
                    active
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-semibold'
                      : 'bg-white/5 text-slate-400 border-white/10 hover:text-slate-200'
                  }`}
                >
                  {active ? '★ ' : '☆ '}
                  {c}
                </button>
              );
            })}
          </div>
        </div>

        {/* Change Password */}
        <div className="pt-4 border-t border-white/10">
          <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-orange-400" /> Change Account Password (Optional)
          </label>
          <input
            type="password"
            className="glass-input text-sm"
            placeholder="Leave blank to keep current password..."
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <button type="submit" disabled={saving} className="btn-primary py-3 px-6 text-sm">
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving Preferences...' : 'Save Profile Changes'}</span>
        </button>
      </form>
    </div>
  );
}
