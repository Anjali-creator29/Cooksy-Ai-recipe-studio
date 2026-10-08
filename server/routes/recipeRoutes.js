const express = require('express');
const router = express.Router();
const { generateRecipe } = require('../services/aiRecipeService');

// @route   POST /api/recipes/generate
// @desc    Generate personalized recipe based on ingredients, cuisine, and dietary preferences
// @access  Public (Optional auth context attached if provided)
router.post('/generate', async (req, res) => {
  try {
    const { ingredients, cuisine, dietary, mealType, maxTime, calories } = req.body;

    if (!ingredients || (Array.isArray(ingredients) && ingredients.length === 0)) {
      return res.status(400).json({
        message: 'Please provide at least one ingredient to generate a personalized recipe.',
      });
    }

    const recipe = await generateRecipe({
      ingredients,
      cuisine,
      dietary,
      mealType,
      maxTime,
      calories,
    });

    res.json({
      success: true,
      recipe,
    });
  } catch (error) {
    console.error('[Recipe Generation Error]', error);
    res.status(500).json({
      message: error.message || 'Failed to generate recipe. Please try again.',
    });
  }
});

module.exports = router;
