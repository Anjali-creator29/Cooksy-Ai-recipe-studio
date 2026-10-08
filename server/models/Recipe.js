const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
  item: { type: String, required: true },
  amount: { type: String, default: '' },
  unit: { type: String, default: '' },
  category: { type: String, default: 'Pantry' },
});

const instructionSchema = new mongoose.Schema({
  stepNumber: { type: Number, required: true },
  text: { type: String, required: true },
  tip: { type: String, default: '' },
});

const recipeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Recipe title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    prepTime: {
      type: String,
      default: '15 mins',
    },
    cookTime: {
      type: String,
      default: '20 mins',
    },
    servings: {
      type: Number,
      default: 2,
    },
    calories: {
      type: Number,
      default: 350,
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Easy',
    },
    cuisine: {
      type: String,
      default: 'International',
    },
    dietaryTags: {
      type: [String],
      default: [],
    },
    ingredients: [ingredientSchema],
    instructions: [instructionSchema],
    nutrition: {
      protein: { type: String, default: '20g' },
      carbs: { type: String, default: '30g' },
      fat: { type: String, default: '12g' },
      fiber: { type: String, default: '5g' },
    },
    collectionName: {
      type: String,
      default: 'Favorites',
    },
    notes: {
      type: String,
      default: '',
    },
    isCustom: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Recipe', recipeSchema);
