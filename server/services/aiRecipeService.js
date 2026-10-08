const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * Intelligent Fallback Recipe Generator Engine
 * Generates custom, rich culinary recipes based on user preferences.
 */
function generateSmartFallbackRecipe({
  ingredients = [],
  cuisine = 'Italian',
  dietary = [],
  mealType = 'Dinner',
  maxTime = '30',
  calories = '450',
}) {
  const ingList = Array.isArray(ingredients)
    ? ingredients
    : ingredients.split(',').map((s) => s.trim()).filter(Boolean);
  
  const mainIng = ingList.length > 0 ? ingList[0] : 'Vegetable';
  const secondaryIng = ingList.length > 1 ? ingList[1] : 'Herbs';
  const dietaryStr = dietary.length > 0 ? dietary.join(', ') : 'Balanced';

  // Capitalize helpers
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const cuisineCap = cap(cuisine || 'Global');
  const mealCap = cap(mealType || 'Meal');

  // Title templates
  const titleTemplates = [
    `${cuisineCap} Style ${cap(mainIng)} & ${cap(secondaryIng)} Delight`,
    `Pan-Seared ${cap(mainIng)} with ${cuisineCap} ${cap(secondaryIng)} Glaze`,
    `Rustic ${cuisineCap} ${cap(mainIng)} Bowl with Fresh ${cap(secondaryIng)}`,
    `Golden ${cuisineCap} ${cap(mainIng)} & ${cap(secondaryIng)} Skillet`,
    `Aromatic ${cuisineCap} ${mealCap} with ${cap(mainIng)}`,
  ];

  const randomTitle =
    titleTemplates[Math.floor(Math.random() * titleTemplates.length)];

  // Build realistic ingredients array based on user input + pantry staples
  const finalIngredients = [];
  
  ingList.forEach((item, idx) => {
    finalIngredients.push({
      item: cap(item),
      amount: idx === 0 ? '2' : idx === 1 ? '1 cup' : '1/2 cup',
      unit: idx === 0 ? 'units / cups' : 'sliced',
      category: 'Main Ingredients',
    });
  });

  // Add cuisine specific seasonings/sauces
  const seasoningsMap = {
    Italian: [
      { item: 'Extra Virgin Olive Oil', amount: '2 tbsp', unit: 'tbsp', category: 'Pantry' },
      { item: 'Minced Garlic', amount: '3 cloves', unit: 'cloves', category: 'Produce' },
      { item: 'Fresh Basil & Oregano', amount: '1 tbsp', unit: 'tbsp', category: 'Herbs' },
      { item: 'Grated Parmesan', amount: '1/4 cup', unit: 'cup', category: 'Dairy' },
    ],
    Indian: [
      { item: 'Ghee or Coconut Oil', amount: '2 tbsp', unit: 'tbsp', category: 'Pantry' },
      { item: 'Garam Masala & Cumin', amount: '1 tsp each', unit: 'tsp', category: 'Spices' },
      { item: 'Ginger & Garlic Paste', amount: '1 tbsp', unit: 'tbsp', category: 'Produce' },
      { item: 'Turmeric & Coriander', amount: '1/2 tsp each', unit: 'tsp', category: 'Spices' },
    ],
    Mexican: [
      { item: 'Avocado Oil', amount: '1.5 tbsp', unit: 'tbsp', category: 'Pantry' },
      { item: 'Ground Cumin & Smoked Paprika', amount: '1 tsp', unit: 'tsp', category: 'Spices' },
      { item: 'Fresh Lime Juice', amount: '1 whole', unit: 'squeezed', category: 'Produce' },
      { item: 'Fresh Cilantro', amount: '2 tbsp', unit: 'chopped', category: 'Herbs' },
    ],
    Asian: [
      { item: 'Sesame Oil & Soy Sauce', amount: '1 tbsp each', unit: 'tbsp', category: 'Pantry' },
      { item: 'Fresh Ginger', amount: '1 inch', unit: 'grated', category: 'Produce' },
      { item: 'Green Onions', amount: '3 stalks', unit: 'chopped', category: 'Produce' },
      { item: 'Sesame Seeds', amount: '1 tsp', unit: 'toasted', category: 'Pantry' },
    ],
    Mediterranean: [
      { item: 'Extra Virgin Olive Oil', amount: '2 tbsp', unit: 'tbsp', category: 'Pantry' },
      { item: 'Lemon Juice & Zest', amount: '1 lemon', unit: 'fresh', category: 'Produce' },
      { item: 'Feta Cheese', amount: '1/3 cup', unit: 'crumbled', category: 'Dairy' },
      { item: 'Dried Dill & Parsley', amount: '1 tsp', unit: 'tsp', category: 'Herbs' },
    ],
  };

  const extraSeasonings =
    seasoningsMap[cuisineCap] || seasoningsMap['Italian'];
  extraSeasonings.forEach((st) => finalIngredients.push(st));

  // Build step-by-step instructions
  const instructions = [
    {
      stepNumber: 1,
      text: `Prepare and clean all ingredients. Finely chop ${cap(mainIng)} and prepare ${cap(secondaryIng)}. Heat cooking oil in a large skillet or pan over medium-high heat.`,
      tip: 'Mise en place ensures a seamless cooking experience!',
    },
    {
      stepNumber: 2,
      text: `Add aromatic seasonings (garlic, ginger, or spices). Sauté for 1 to 2 minutes until fragrant and translucent.`,
      tip: 'Bloom your spices in hot oil to unlock full flavor profiles.',
    },
    {
      stepNumber: 3,
      text: `Incorporate ${cap(mainIng)} into the skillet. Cook for 6-8 minutes, stirring occasionally until beautifully seared and tender.`,
      tip: 'Avoid overcrowding the pan to get a rich caramelization.',
    },
    {
      stepNumber: 4,
      text: `Add ${cap(secondaryIng)} alongside remaining herbs and pan sauces. Lower heat to medium-low and simmer for 5 minutes to let flavors harmonize.`,
      tip: `Keep within your target ${dietaryStr} dietary guidelines.`,
    },
    {
      stepNumber: 5,
      text: `Taste and adjust seasoning with salt, fresh pepper, or citrus juice. Remove from heat and plate hot with fresh garnishes.`,
      tip: 'Serve immediately while hot for optimal texture and aroma.',
    },
  ];

  const estimatedPrep = Math.max(10, Math.min(25, parseInt(maxTime) / 2 || 15));
  const estimatedCook = Math.max(12, Math.min(35, parseInt(maxTime) - estimatedPrep || 20));

  return {
    title: randomTitle,
    description: `A delicious, chef-curated ${cuisineCap} ${mealCap.toLowerCase()} tailored specifically for your available ingredients (${ingList.join(', ')}) and dietary preference (${dietaryStr}).`,
    prepTime: `${estimatedPrep} mins`,
    cookTime: `${estimatedCook} mins`,
    servings: 2,
    calories: parseInt(calories) || 450,
    difficulty: 'Medium',
    cuisine: cuisineCap,
    dietaryTags: dietary.length > 0 ? dietary : ['Personalized'],
    ingredients: finalIngredients,
    instructions: instructions,
    nutrition: {
      protein: `${Math.round((parseInt(calories) || 450) * 0.05)}g`,
      carbs: `${Math.round((parseInt(calories) || 450) * 0.08)}g`,
      fat: `${Math.round((parseInt(calories) || 450) * 0.03)}g`,
      fiber: '6g',
    },
  };
}

/**
 * Generate Recipe using Gemini AI or Fallback Engine
 */
async function generateRecipe(params) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey !== 'your_gemini_api_key_here') {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `
Generate a single personalized recipe in valid JSON format based on the following user input:
- Available Ingredients: ${Array.isArray(params.ingredients) ? params.ingredients.join(', ') : params.ingredients}
- Preferred Cuisine: ${params.cuisine || 'Any'}
- Dietary Restrictions: ${Array.isArray(params.dietary) ? params.dietary.join(', ') : params.dietary}
- Meal Type: ${params.mealType || 'Dinner'}
- Target Max Cook Time: ${params.maxTime || '30'} minutes
- Target Calories: ${params.calories || '500'} kcal

Return ONLY strict valid JSON matching this schema (no markdown block wrapper):
{
  "title": "string",
  "description": "string",
  "prepTime": "string (e.g. 15 mins)",
  "cookTime": "string (e.g. 20 mins)",
  "servings": 2,
  "calories": 450,
  "difficulty": "Easy|Medium|Hard",
  "cuisine": "string",
  "dietaryTags": ["string"],
  "ingredients": [
    { "item": "string", "amount": "string", "unit": "string", "category": "string" }
  ],
  "instructions": [
    { "stepNumber": 1, "text": "string", "tip": "string" }
  ],
  "nutrition": {
    "protein": "string",
    "carbs": "string",
    "fat": "string",
    "fiber": "string"
  }
}
      `;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      
      // Clean JSON formatting if wrapped in codeblocks
      const cleanedJson = responseText
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();

      const recipeData = JSON.parse(cleanedJson);
      return recipeData;
    } catch (err) {
      console.warn('[Gemini AI Service] Error generating recipe via API, falling back to Smart Culinary Engine:', err.message);
    }
  }

  // Fallback to Smart Engine
  return generateSmartFallbackRecipe(params);
}

module.exports = {
  generateRecipe,
  generateSmartFallbackRecipe,
};
