import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Flame, Lock, Mail, User, ChefHat, ShieldAlert, ArrowRight } from 'lucide-react';

const DIETARY_OPTIONS = ['Vegan', 'Vegetarian', 'Gluten-Free', 'Keto', 'Dairy-Free', 'Low-Carb', 'Nut-Free'];

export default function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, register, user } = useAuth();

  const searchParams = new URLSearchParams(location.search);
  const initialMode = searchParams.get('mode') === 'register' ? 'register' : 'login';
  const redirect = searchParams.get('redirect') || '/';

  const [mode, setMode] = useState(initialMode);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dietaryPreferences, setDietaryPreferences] = useState(['Gluten-Free']);
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (user) {
      navigate(redirect);
    }
  }, [user, navigate, redirect]);

  const toggleDietary = (item) => {
    if (dietaryPreferences.includes(item)) {
      setDietaryPreferences(dietaryPreferences.filter((d) => d !== item));
    } else {
      setDietaryPreferences([...dietaryPreferences, item]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(name, email, password, dietaryPreferences);
      }
      navigate(redirect);
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-md p-6 sm:p-8 relative border-white/10 shadow-2xl">
        {/* Header Icon */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center mx-auto shadow-lg shadow-orange-500/20 mb-3">
            <Flame className="w-8 h-8 text-white fill-white/20 animate-pulse" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            {mode === 'login' ? 'Welcome Back to Cooksy' : 'Create Your Cooksy Vault'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {mode === 'login'
              ? 'Sign in to access your saved recipes & personalized engine.'
              : 'Join Cooksy to save personalized recipes and preferences.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-900/60 p-1 rounded-xl mb-6 border border-white/10">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              mode === 'login'
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              mode === 'register'
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
                <input
                  type="text"
                  required
                  className="glass-input pl-9 text-sm"
                  placeholder="Chef Jane Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
              <input
                type="email"
                required
                className="glass-input pl-9 text-sm"
                placeholder="chef@cooksy.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-slate-300">Password</label>
              {mode === 'login' && (
                <Link
                  to="/forgot-password"
                  className="text-xs text-orange-400 hover:text-orange-300 transition-colors"
                >
                  Forgot Password?
                </Link>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
              <input
                type="password"
                required
                minLength={6}
                className="glass-input pl-9 text-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Dietary selection when registering */}
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Default Dietary Preferences
              </label>
              <div className="flex flex-wrap gap-1.5">
                {DIETARY_OPTIONS.map((d) => {
                  const active = dietaryPreferences.includes(d);
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => toggleDietary(d)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                        active
                          ? 'bg-orange-500/20 text-orange-300 border-orange-500/40'
                          : 'bg-white/5 text-slate-400 border-white/10'
                      }`}
                    >
                      {active ? '✓ ' : '+ '}
                      {d}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 rounded-xl text-sm mt-2"
          >
            {loading ? 'Processing...' : mode === 'login' ? 'Sign In to Vault' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}
