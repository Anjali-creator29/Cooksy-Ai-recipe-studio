import React, { useState } from 'react';
import RecipeWizard from '../components/RecipeWizard';
import RecipeCard from '../components/RecipeCard';
import RecipeDetailModal from '../components/RecipeDetailModal';
import { useRecipe } from '../context/RecipeContext';
import { Sparkles, Flame, ShieldCheck, Bookmark, ArrowRight, Utensils } from 'lucide-react';

const FEATURED_SAMPLES = [
  {
    _id: 'sample-1',
    title: 'Tuscan Garlic Lemon Herb Chicken',
    description: 'Tender pan-seared chicken breasts smothered in a velvety Mediterranean garlic lemon butter sauce with fresh spinach.',
    prepTime: '15 mins',
    cookTime: '20 mins',
    servings: 2,
    calories: 480,
    difficulty: 'Easy',
    cuisine: 'Italian',
    dietaryTags: ['Gluten-Free', 'Keto'],
    ingredients: [
      { item: 'Chicken Breast', amount: '2', unit: 'halves', category: 'Poultry' },
      { item: 'Minced Garlic', amount: '4', unit: 'cloves', category: 'Produce' },
      { item: 'Fresh Spinach', amount: '2 cups', unit: 'packed', category: 'Produce' },
      { item: 'Extra Virgin Olive Oil', amount: '2 tbsp', unit: 'tbsp', category: 'Pantry' },
    ],
    instructions: [
      { stepNumber: 1, text: 'Season chicken breasts liberally with sea salt, black pepper, and Italian herbs.', tip: 'Pat chicken dry with paper towels first for a crisp sear.' },
      { stepNumber: 2, text: 'Heat olive oil in a skillet over medium-high heat. Sear chicken 6-7 minutes per side until golden.', tip: 'Ensure internal temperature reaches 165°F.' },
      { stepNumber: 3, text: 'Lower heat, add minced garlic and fresh spinach. Simmer for 3 minutes until spinach is wilted.', tip: 'Finish with a fresh squeeze of lemon.' },
    ],
    nutrition: { protein: '38g', carbs: '8g', fat: '18g', fiber: '3g' },
  },
  {
    _id: 'sample-2',
    title: 'Avocado Sesame Tofu Power Bowl',
    description: 'Crispy pan-fried tofu cubes paired with creamy avocado, edamame, and warm quinoa in a sweet ginger sesame glaze.',
    prepTime: '12 mins',
    cookTime: '15 mins',
    servings: 2,
    calories: 420,
    difficulty: 'Easy',
    cuisine: 'Asian',
    dietaryTags: ['Vegan', 'Gluten-Free', 'Dairy-Free'],
    ingredients: [
      { item: 'Extra Firm Tofu', amount: '1 block', unit: 'cubed', category: 'Protein' },
      { item: 'Fresh Avocado', amount: '1', unit: 'sliced', category: 'Produce' },
      { item: 'Cooked Quinoa', amount: '1.5 cups', unit: 'warm', category: 'Grains' },
      { item: 'Tamari / Soy Sauce', amount: '2 tbsp', unit: 'tbsp', category: 'Pantry' },
    ],
    instructions: [
      { stepNumber: 1, text: 'Press tofu dry and cut into 1-inch bite-sized cubes.', tip: 'Toss in a pinch of cornstarch for extra crunch.' },
      { stepNumber: 2, text: 'Pan-fry tofu in sesame oil for 8 minutes, turning until all sides are crisp and golden.', tip: 'Don’t overcrowd the pan.' },
      { stepNumber: 3, text: 'Assemble bowls with quinoa, sliced avocado, edamame, and drizzle with ginger sesame glaze.', tip: 'Top with toasted sesame seeds.' },
    ],
    nutrition: { protein: '22g', carbs: '45g', fat: '16g', fiber: '9g' },
  },
];

export default function Home() {
  const { generatedRecipe, bookmarks } = useRecipe();
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenDetail = (recipe) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  };

  const isBookmarkedCheck = (recipeId) => {
    return bookmarks.some((b) => b._id === recipeId || b.title === selectedRecipe?.title);
  };

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Header */}
      <section className="text-center pt-8 pb-4 max-w-3xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/25 text-orange-300 text-xs font-semibold mb-4 animate-glow">
          <Sparkles className="w-3.5 h-3.5 text-orange-400" />
          <span>Next-Gen MERN Culinary Intelligence</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Turn Pantry Ingredients into{' '}
          <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-200 bg-clip-text text-transparent">
            Gourmet Personalized Recipes
          </span>
        </h1>

        <p className="mt-4 text-slate-300 text-base sm:text-lg leading-relaxed">
          Specify your available ingredients, preferred cuisine, and dietary requirements. Cooksy generates custom step-by-step recipes complete with nutritional macros and step timers.
        </p>
      </section>

      {/* Recipe Wizard Component */}
      <section className="px-4">
        <RecipeWizard
          onRecipeGenerated={(recipe) => {
            setSelectedRecipe(recipe);
            setIsModalOpen(true);
          }}
        />
      </section>

      {/* Generated Result Highlight */}
      {generatedRecipe && (
        <section className="max-w-4xl mx-auto px-4 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-orange-400" />
              Your Generated Recipe Result
            </h2>
          </div>
          <RecipeCard
            recipe={generatedRecipe}
            onOpenDetail={handleOpenDetail}
            isBookmarked={isBookmarkedCheck(generatedRecipe._id)}
          />
        </section>
      )}

      {/* Featured Recipe Inspiration Showcase */}
      <section className="max-w-6xl mx-auto px-4 pt-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Utensils className="w-5 h-5 text-orange-400" />
              Featured Culinary Inspiration
            </h2>
            <p className="text-xs text-slate-400">Sample chef-crafted recipes ready to cook or save.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FEATURED_SAMPLES.map((recipe) => (
            <RecipeCard
              key={recipe._id}
              recipe={recipe}
              onOpenDetail={handleOpenDetail}
              isBookmarked={isBookmarkedCheck(recipe._id)}
            />
          ))}
        </div>
      </section>

      {/* Detail Modal */}
      <RecipeDetailModal
        recipe={selectedRecipe}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isBookmarked={isBookmarkedCheck(selectedRecipe?._id)}
      />
    </div>
  );
}
