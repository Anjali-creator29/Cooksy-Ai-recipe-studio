// Curated, ultra-fast CDN food photography mapped to cuisines and dish types
const FOOD_PHOTOS = {
  // Cuisines
  italian: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80',
  indian: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80',
  mexican: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80',
  asian: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
  mediterranean: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
  japanese: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
  french: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=80',
  american: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
  'middle eastern': 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=800&q=80',

  // Dish Types & Ingredients
  chicken: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80',
  pasta: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281781?auto=format&fit=crop&w=800&q=80',
  pizza: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
  salmon: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80',
  tofu: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
  salad: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
  soup: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80',
  rice: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=800&q=80',
  burger: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
  curry: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80',
  taco: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80',
  breakfast: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80',
  dessert: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
  default: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
};

/**
 * Resolves a high-quality, lightweight food image for any recipe.
 */
export function getRecipeImageUrl(recipe) {
  if (recipe?.imageUrl && typeof recipe.imageUrl === 'string' && recipe.imageUrl.startsWith('http')) {
    return recipe.imageUrl;
  }

  const title = (recipe?.title || '').toLowerCase();
  const cuisine = (recipe?.cuisine || '').toLowerCase();
  
  const ingString = Array.isArray(recipe?.ingredients)
    ? recipe.ingredients.map(i => (typeof i === 'string' ? i : i.item || '')).join(' ').toLowerCase()
    : (recipe?.ingredients || '').toString().toLowerCase();

  const combined = `${title} ${cuisine} ${ingString}`;

  // Match specific food keywords
  if (combined.includes('pizza')) return FOOD_PHOTOS.pizza;
  if (combined.includes('pasta') || combined.includes('spaghetti')) return FOOD_PHOTOS.pasta;
  if (combined.includes('chicken')) return FOOD_PHOTOS.chicken;
  if (combined.includes('salmon') || combined.includes('fish')) return FOOD_PHOTOS.salmon;
  if (combined.includes('tofu')) return FOOD_PHOTOS.tofu;
  if (combined.includes('salad') || combined.includes('bowl')) return FOOD_PHOTOS.salad;
  if (combined.includes('soup') || combined.includes('broth')) return FOOD_PHOTOS.soup;
  if (combined.includes('curry') || combined.includes('masala')) return FOOD_PHOTOS.curry;
  if (combined.includes('taco')) return FOOD_PHOTOS.taco;
  if (combined.includes('burger')) return FOOD_PHOTOS.burger;
  if (combined.includes('pancake') || combined.includes('waffle') || combined.includes('egg') || combined.includes('breakfast')) {
    return FOOD_PHOTOS.breakfast;
  }
  if (combined.includes('dessert') || combined.includes('cake') || combined.includes('chocolate')) {
    return FOOD_PHOTOS.dessert;
  }

  // Match cuisine
  if (FOOD_PHOTOS[cuisine]) {
    return FOOD_PHOTOS[cuisine];
  }

  return FOOD_PHOTOS.default;
}

export const FALLBACK_FOOD_IMAGE = FOOD_PHOTOS.default;
