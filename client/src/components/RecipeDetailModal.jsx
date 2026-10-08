import React, { useState, useEffect } from 'react';
import {
  X,
  Clock,
  Flame,
  ChefHat,
  Bookmark,
  CheckCircle,
  Play,
  Pause,
  RotateCcw,
  Printer,
  Sparkles,
  Zap,
  Info,
  CheckSquare,
  Square,
} from 'lucide-react';
import BookmarkModal from './BookmarkModal';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function RecipeDetailModal({ recipe, isOpen, onClose, isBookmarked = false, onBookmarkSaved }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [completedSteps, setCompletedSteps] = useState([]);
  const [checkedIngredients, setCheckedIngredients] = useState([]);
  
  // Timer State
  const [timerSeconds, setTimerSeconds] = useState(300); // default 5 mins timer
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerInput, setTimerInput] = useState('5');
  
  const [isBookmarkModalOpen, setIsBookmarkModalOpen] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  if (!isOpen || !recipe) return null;

  const toggleStep = (stepNumber) => {
    if (completedSteps.includes(stepNumber)) {
      setCompletedSteps(completedSteps.filter((s) => s !== stepNumber));
    } else {
      setCompletedSteps([...completedSteps, stepNumber]);
    }
  };

  const toggleIngredient = (idx) => {
    if (checkedIngredients.includes(idx)) {
      setCheckedIngredients(checkedIngredients.filter((i) => i !== idx));
    } else {
      setCheckedIngredients([...checkedIngredients, idx]);
    }
  };

  const handleStartTimer = (minutes = 5) => {
    const mins = parseInt(minutes) || 5;
    setTimerSeconds(mins * 60);
    setIsTimerRunning(true);
  };

  const formatTimer = (totalSec) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handlePrint = () => {
    window.print();
  };

  const handleBookmarkClick = () => {
    if (!user) {
      navigate('/auth?mode=login');
      return;
    }
    setIsBookmarkModalOpen(true);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in print:bg-white print:text-black">
        <div className="glass-card w-full max-w-4xl my-auto p-6 sm:p-8 relative border-white/15 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto print:max-h-none print:shadow-none print:border-none print:bg-white">
          
          {/* Top Bar Actions */}
          <div className="flex items-center justify-between gap-4 mb-6 border-b border-white/10 pb-4 print:hidden">
            <div className="flex items-center gap-2">
              <span className="chip chip-active text-xs">
                {recipe.cuisine || 'International'} Cuisine
              </span>
              {recipe.difficulty && (
                <span className="chip bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-xs">
                  {recipe.difficulty}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="btn-secondary py-1.5 px-3 text-xs"
                title="Print Recipe"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Print</span>
              </button>

              <button
                onClick={handleBookmarkClick}
                className={`py-1.5 px-3 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isBookmarked
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'btn-primary py-1.5'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-emerald-400' : ''}`} />
                <span>{isBookmarked ? 'Bookmarked' : 'Save to Vault'}</span>
              </button>

              <button
                onClick={onClose}
                className="p-1.5 rounded-full bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition-colors ml-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Recipe Header */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2 print:text-black">
              {recipe.title}
            </h1>
            {recipe.description && (
              <p className="text-sm text-slate-300 print:text-slate-700 leading-relaxed">
                {recipe.description}
              </p>
            )}

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                <Clock className="w-5 h-5 text-orange-400" />
                <div>
                  <span className="block text-[11px] text-slate-400 uppercase font-semibold">Prep / Cook</span>
                  <span className="text-sm font-bold text-white">{recipe.prepTime || '15m'} / {recipe.cookTime || '20m'}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                <Flame className="w-5 h-5 text-amber-400" />
                <div>
                  <span className="block text-[11px] text-slate-400 uppercase font-semibold">Calories</span>
                  <span className="text-sm font-bold text-white">{recipe.calories || 450} kcal</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                <ChefHat className="w-5 h-5 text-emerald-400" />
                <div>
                  <span className="block text-[11px] text-slate-400 uppercase font-semibold">Servings</span>
                  <span className="text-sm font-bold text-white">{recipe.servings || 2} People</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                <Zap className="w-5 h-5 text-rose-400" />
                <div>
                  <span className="block text-[11px] text-slate-400 uppercase font-semibold">Protein</span>
                  <span className="text-sm font-bold text-white">{recipe.nutrition?.protein || '24g'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Cooking Timer Widget (Hidden when printing) */}
          <div className="p-4 mb-6 rounded-2xl bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-slate-900 border border-orange-500/20 flex flex-wrap items-center justify-between gap-4 print:hidden">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
                <Clock className="w-5 h-5 animate-spin" style={{ animationDuration: isTimerRunning ? '3s' : '0s' }} />
              </div>
              <div>
                <span className="block text-xs font-semibold text-slate-300">Kitchen Cooking Timer</span>
                <span className="text-2xl font-mono font-bold text-orange-400">{formatTimer(timerSeconds)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="60"
                value={timerInput}
                onChange={(e) => setTimerInput(e.target.value)}
                className="w-14 glass-input text-xs text-center py-1.5"
                placeholder="mins"
              />
              <span className="text-xs text-slate-400">mins</span>

              {isTimerRunning ? (
                <button
                  onClick={() => setIsTimerRunning(false)}
                  className="btn-secondary py-1.5 px-3 text-xs bg-amber-500/20 text-amber-300 border-amber-500/40"
                >
                  <Pause className="w-3.5 h-3.5" /> Pause
                </button>
              ) : (
                <button
                  onClick={() => handleStartTimer(timerInput)}
                  className="btn-primary py-1.5 px-3 text-xs"
                >
                  <Play className="w-3.5 h-3.5" /> Start
                </button>
              )}

              <button
                onClick={() => {
                  setIsTimerRunning(false);
                  setTimerSeconds(parseInt(timerInput || 5) * 60);
                }}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400"
                title="Reset Timer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Main Content Layout: Ingredients + Instructions */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Left Column: Ingredients */}
            <div className="md:col-span-5 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 print:text-black">
                <ChefHat className="w-5 h-5 text-orange-400" />
                Ingredients ({recipe.ingredients?.length || 0})
              </h3>
              <p className="text-xs text-slate-400 print:hidden">Tap ingredients to cross them off as you prep.</p>

              <div className="space-y-2">
                {recipe.ingredients?.map((ing, idx) => {
                  const isChecked = checkedIngredients.includes(idx);
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleIngredient(idx)}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                        isChecked
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-slate-400 line-through'
                          : 'bg-white/5 border-white/10 text-slate-200 hover:border-white/20'
                      }`}
                    >
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-500 shrink-0" />
                      )}
                      <div className="flex-1 text-sm">
                        <span className="font-semibold text-orange-300 mr-1.5">
                          {ing.amount} {ing.unit}
                        </span>
                        <span>{ing.item}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Nutrition breakdown card */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mt-4">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Nutritional Breakdown</h4>
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/20">
                    <span className="block font-bold text-orange-400">{recipe.nutrition?.protein || '22g'}</span>
                    <span className="text-[10px] text-slate-400">Protein</span>
                  </div>
                  <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <span className="block font-bold text-amber-400">{recipe.nutrition?.carbs || '35g'}</span>
                    <span className="text-[10px] text-slate-400">Carbs</span>
                  </div>
                  <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20">
                    <span className="block font-bold text-rose-400">{recipe.nutrition?.fat || '14g'}</span>
                    <span className="text-[10px] text-slate-400">Fat</span>
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <span className="block font-bold text-emerald-400">{recipe.nutrition?.fiber || '6g'}</span>
                    <span className="text-[10px] text-slate-400">Fiber</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Step-by-Step Cooking Checklist */}
            <div className="md:col-span-7 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center justify-between print:text-black">
                <span className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  Step-by-Step Instructions
                </span>
                <span className="text-xs font-normal text-slate-400">
                  {completedSteps.length} of {recipe.instructions?.length || 0} Done
                </span>
              </h3>

              <div className="space-y-3">
                {recipe.instructions?.map((inst) => {
                  const isDone = completedSteps.includes(inst.stepNumber);
                  return (
                    <div
                      key={inst.stepNumber}
                      onClick={() => toggleStep(inst.stepNumber)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                        isDone
                          ? 'bg-emerald-500/10 border-emerald-500/30 opacity-75'
                          : 'bg-slate-900/60 border-white/10 hover:border-orange-500/30'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                            isDone
                              ? 'bg-emerald-500 text-white'
                              : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                          }`}
                        >
                          {isDone ? <CheckCircle className="w-4 h-4" /> : inst.stepNumber}
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm leading-relaxed ${isDone ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                            {inst.text}
                          </p>
                          {inst.tip && (
                            <div className="mt-2 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-1.5">
                              <Info className="w-3.5 h-3.5 shrink-0" />
                              <span><strong>Chef Tip:</strong> {inst.tip}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </div>

      <BookmarkModal
        recipe={recipe}
        isOpen={isBookmarkModalOpen}
        onClose={() => setIsBookmarkModalOpen(false)}
        onSaved={onBookmarkSaved}
      />
    </>
  );
}
