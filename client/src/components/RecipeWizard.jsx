import React, { useState } from 'react';
import { Sparkles, Plus, X, Utensils, Clock, Flame, ShieldAlert, ChefHat, Check } from 'lucide-react';
import { useRecipe } from '../context/RecipeContext';

const PRESET_INGREDIENTS = [
  'Chicken Breast', 'Garlic', 'Spinach', 'Tomatoes', 'Olive Oil',
  'Salmon', 'Tofu', 'Avocado', 'Eggs', 'Rice', 'Pasta', 'Mushrooms',
  'Onion', 'Lemon', 'Bell Peppers', 'Greek Yogurt', 'Quinoa', 'Cheese'
];

const CUISINES = [
  'Italian', 'Indian', 'Mexican', 'Mediterranean', 'Asian', 
  'French', 'Japanese', 'American', 'Middle Eastern'
];

const DIETARY_OPTIONS = [
  'Vegan', 'Vegetarian', 'Gluten-Free', 'Keto', 
  'Dairy-Free', 'Low-Carb', 'Nut-Free', 'Halal', 'Kosher'
];

const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert'];

export default function RecipeWizard({ onRecipeGenerated }) {
  const { generateRecipe, loading } = useRecipe();
  
  const [ingredients, setIngredients] = useState(['Chicken Breast', 'Garlic', 'Spinach']);
  const [inputTag, setInputTag] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('Italian');
  const [selectedDietary, setSelectedDietary] = useState(['Gluten-Free']);
  const [mealType, setMealType] = useState('Dinner');
  const [maxTime, setMaxTime] = useState('30');
  const [calories, setCalories] = useState('500');
  const [errorMsg, setErrorMsg] = useState('');

  const handleAddIngredient = (e) => {
    e?.preventDefault();
    if (inputTag.trim() && !ingredients.includes(inputTag.trim())) {
      setIngredients([...ingredients, inputTag.trim()]);
      setInputTag('');
      setErrorMsg('');
    }
  };

  const handleTogglePreset = (item) => {
    if (ingredients.includes(item)) {
      setIngredients(ingredients.filter((i) => i !== item));
    } else {
      setIngredients([...ingredients, item]);
      setErrorMsg('');
    }
  };

  const handleRemoveIngredient = (item) => {
    setIngredients(ingredients.filter((i) => i !== item));
  };

  const handleToggleDietary = (item) => {
    if (selectedDietary.includes(item)) {
      setSelectedDietary(selectedDietary.filter((d) => d !== item));
    } else {
      setSelectedDietary([...selectedDietary, item]);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (ingredients.length === 0) {
      setErrorMsg('Please select or enter at least one ingredient.');
      return;
    }

    try {
      setErrorMsg('');
      const recipe = await generateRecipe({
        ingredients,
        cuisine: selectedCuisine,
        dietary: selectedDietary,
        mealType,
        maxTime,
        calories,
      });
      if (onRecipeGenerated) {
        onRecipeGenerated(recipe);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Error generating recipe. Please try again.');
    }
  };

  return (
    <div className="glass-card p-6 md:p-8 max-w-4xl mx-auto border-white/10 shadow-2xl relative overflow-hidden">
      {/* Glow Backdrop */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
          <ChefHat className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Personalized Recipe Studio
          </h2>
          <p className="text-sm text-slate-400">
            Tell Cooksy what's in your pantry, select your preferences, and watch the AI craft a bespoke recipe.
          </p>
        </div>
      </div>

      <form onSubmit={handleGenerate} className="space-y-6">
        {/* Section 1: Pantry Ingredients */}
        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-2">
            1. Available Ingredients in Your Pantry <span className="text-orange-400">*</span>
          </label>

          {/* Add custom tag input */}
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              className="glass-input"
              placeholder="Type an ingredient (e.g. Chicken, Basil, Tofu) & press Enter..."
              value={inputTag}
              onChange={(e) => setInputTag(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddIngredient(e)}
            />
            <button
              type="button"
              onClick={handleAddIngredient}
              className="btn-secondary whitespace-nowrap"
            >
              <Plus className="w-4 h-4 text-orange-400" />
              Add
            </button>
          </div>

          {/* Current selected tags */}
          <div className="flex flex-wrap gap-2 mb-3 min-h-[38px] p-2 bg-slate-900/50 rounded-xl border border-white/5">
            {ingredients.length === 0 ? (
              <span className="text-xs text-slate-500 italic p-1">No ingredients added yet. Tap presets below or type above.</span>
            ) : (
              ingredients.map((item) => (
                <span
                  key={item}
                  className="chip chip-active flex items-center gap-1.5 shadow-sm text-sm"
                >
                  {item}
                  <button
                    type="button"
                    onClick={() => handleRemoveIngredient(item)}
                    className="hover:text-red-300 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))
            )}
          </div>

          {/* Preset ingredient chips */}
          <div className="space-y-1.5">
            <span className="text-xs text-slate-400 font-medium">Quick Pantry Suggestions:</span>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_INGREDIENTS.map((item) => {
                const isSelected = ingredients.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleTogglePreset(item)}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                      isSelected
                        ? 'bg-orange-500/20 text-orange-300 border-orange-500/40'
                        : 'bg-white/5 text-slate-400 border-white/10 hover:border-white/20 hover:text-slate-200'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {item}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section 2: Cuisine & Meal Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2 flex items-center gap-1.5">
              <Utensils className="w-4 h-4 text-orange-400" /> Preferred Cuisine
            </label>
            <select
              value={selectedCuisine}
              onChange={(e) => setSelectedCuisine(e.target.value)}
              className="glass-input cursor-pointer"
            >
              {CUISINES.map((c) => (
                <option key={c} value={c} className="bg-slate-900 text-slate-200">
                  {c} Cuisine
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-orange-400" /> Meal Type
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
              {MEAL_TYPES.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMealType(m)}
                  className={`text-xs py-2 px-1 rounded-lg font-medium border text-center transition-all ${
                    mealType === m
                      ? 'bg-orange-500 text-white border-orange-500 font-semibold shadow-sm'
                      : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section 3: Dietary Restrictions */}
        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-2">
            3. Dietary Preferences & Restrictions
          </label>
          <div className="flex flex-wrap gap-2">
            {DIETARY_OPTIONS.map((d) => {
              const isSelected = selectedDietary.includes(d);
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => handleToggleDietary(d)}
                  className={`chip chip-selectable ${
                    isSelected ? 'chip-active' : 'bg-white/5 text-slate-300 border-white/10 hover:border-white/20'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                  {d}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 4: Target Prep Time & Calories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-white/10">
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
              <span>Max Preparation Time</span>
              <span className="text-orange-400 font-bold">{maxTime} Minutes</span>
            </div>
            <input
              type="range"
              min="10"
              max="90"
              step="5"
              value={maxTime}
              onChange={(e) => setMaxTime(e.target.value)}
              className="w-full accent-orange-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
              <span>Calorie Target</span>
              <span className="text-amber-400 font-bold">{calories} Kcal</span>
            </div>
            <input
              type="range"
              min="200"
              max="1200"
              step="50"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full text-base py-3.5 rounded-xl shadow-lg"
          >
            {loading ? (
              <>
                <Sparkles className="w-5 h-5 animate-spin" />
                <span>Culinary AI Crafting Recipe...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-yellow-200" />
                <span>Generate Recipe</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
