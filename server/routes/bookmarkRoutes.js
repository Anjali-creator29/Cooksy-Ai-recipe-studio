const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');
const { protect } = require('../middleware/auth');

// All bookmark routes require JWT protection
router.use(protect);

// @route   GET /api/bookmarks
// @desc    Get all bookmarked recipes for logged in user
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { search, cuisine, collectionName, dietary } = req.query;

    const query = { user: req.user._id };

    if (cuisine && cuisine !== 'All') {
      query.cuisine = cuisine;
    }

    if (collectionName && collectionName !== 'All') {
      query.collectionName = collectionName;
    }

    if (dietary && dietary !== 'All') {
      query.dietaryTags = { $in: [dietary] };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'ingredients.item': { $regex: search, $options: 'i' } },
      ];
    }

    const bookmarks = await Recipe.find(query).sort({ createdAt: -1 });

    res.json({
      count: bookmarks.length,
      bookmarks,
    });
  } catch (error) {
    console.error('[Get Bookmarks Error]', error);
    res.status(500).json({ message: error.message || 'Failed to fetch bookmarks' });
  }
});

// @route   POST /api/bookmarks
// @desc    Save a recipe to user's MongoDB bookmarks
// @access  Private
router.post('/', async (req, res) => {
  try {
    const {
      title,
      description,
      prepTime,
      cookTime,
      servings,
      calories,
      difficulty,
      cuisine,
      dietaryTags,
      ingredients,
      instructions,
      nutrition,
      collectionName,
      notes,
      isCustom,
    } = req.body;

    if (!title || !ingredients || ingredients.length === 0) {
      return res.status(400).json({ message: 'Recipe title and ingredients are required' });
    }

    const bookmark = await Recipe.create({
      user: req.user._id,
      title,
      description: description || '',
      prepTime: prepTime || '15 mins',
      cookTime: cookTime || '20 mins',
      servings: servings || 2,
      calories: calories || 450,
      difficulty: difficulty || 'Medium',
      cuisine: cuisine || 'International',
      dietaryTags: dietaryTags || [],
      ingredients,
      instructions,
      nutrition: nutrition || {},
      collectionName: collectionName || 'Favorites',
      notes: notes || '',
      isCustom: Boolean(isCustom),
    });

    res.status(201).json({
      success: true,
      bookmark,
    });
  } catch (error) {
    console.error('[Save Bookmark Error]', error);
    res.status(500).json({ message: error.message || 'Failed to save recipe bookmark' });
  }
});

// @route   PUT /api/bookmarks/:id
// @desc    Update a saved bookmark (notes, collection name, details)
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const bookmark = await Recipe.findById(req.params.id);

    if (!bookmark) {
      return res.status(404).json({ message: 'Bookmark not found' });
    }

    // Verify ownership
    if (bookmark.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to edit this bookmark' });
    }

    const fieldsToUpdate = [
      'title',
      'description',
      'prepTime',
      'cookTime',
      'servings',
      'calories',
      'difficulty',
      'cuisine',
      'dietaryTags',
      'ingredients',
      'instructions',
      'nutrition',
      'collectionName',
      'notes',
    ];

    fieldsToUpdate.forEach((field) => {
      if (req.body[field] !== undefined) {
        bookmark[field] = req.body[field];
      }
    });

    const updatedBookmark = await bookmark.save();

    res.json({
      success: true,
      bookmark: updatedBookmark,
    });
  } catch (error) {
    console.error('[Update Bookmark Error]', error);
    res.status(500).json({ message: error.message || 'Failed to update bookmark' });
  }
});

// @route   DELETE /api/bookmarks/:id
// @desc    Remove a recipe bookmark
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const bookmark = await Recipe.findById(req.params.id);

    if (!bookmark) {
      return res.status(404).json({ message: 'Bookmark not found' });
    }

    if (bookmark.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this bookmark' });
    }

    await bookmark.deleteOne();

    res.json({
      success: true,
      message: 'Recipe removed from bookmarks',
    });
  } catch (error) {
    console.error('[Delete Bookmark Error]', error);
    res.status(500).json({ message: error.message || 'Failed to delete bookmark' });
  }
});

module.exports = router;
