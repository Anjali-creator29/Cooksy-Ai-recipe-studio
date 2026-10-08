const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Helper to generate JWT Token
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'cooksy_super_secret_jwt_key_2026_safe',
    {
      expiresIn: process.env.JWT_EXPIRE || '30d',
    }
  );
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, dietaryPreferences, favoriteCuisines } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const user = await User.create({
      name,
      email,
      password,
      dietaryPreferences: dietaryPreferences || [],
      favoriteCuisines: favoriteCuisines || [],
    });

    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        dietaryPreferences: user.dietaryPreferences,
        favoriteCuisines: user.favoriteCuisines,
      },
    });
  } catch (error) {
    console.error('[Register Error]', error);
    res.status(500).json({ message: error.message || 'Server error during registration' });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        dietaryPreferences: user.dietaryPreferences,
        favoriteCuisines: user.favoriteCuisines,
      },
    });
  } catch (error) {
    console.error('[Login Error]', error);
    res.status(500).json({ message: error.message || 'Server error during login' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', protect, async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      dietaryPreferences: req.user.dietaryPreferences,
      favoriteCuisines: req.user.favoriteCuisines,
    },
  });
});

// @route   PUT /api/auth/profile
// @desc    Update user profile & preferences
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.dietaryPreferences = req.body.dietaryPreferences || user.dietaryPreferences;
      user.favoriteCuisines = req.body.favoriteCuisines || user.favoriteCuisines;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        user: {
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          dietaryPreferences: updatedUser.dietaryPreferences,
          favoriteCuisines: updatedUser.favoriteCuisines,
        },
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

// @route   POST /api/auth/forgot-password
// @desc    Forgot Password - Generate SHA-256 hashed reset token & send link
// @access  Public
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'There is no user with that email' });
    }

    // Get reset token (unhashed) and save hashed token + expiry in DB
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // Create reset URL
    const resetUrl = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;

    res.json({
      success: true,
      message: 'Password reset link generated successfully.',
      resetToken, // Returned for dev testing & inline preview link
      resetUrl,
    });
  } catch (error) {
    console.error('[Forgot Password Error]', error);
    res.status(500).json({ message: 'Could not process password reset request' });
  }
});

// @route   PUT /api/auth/reset-password/:resetToken
// @desc    Reset password using SHA-256 hashed token validation
// @access  Public
router.put('/reset-password/:resetToken', async (req, res) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resetToken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired password reset token' });
    }

    if (!req.body.password || req.body.password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    // Sign new JWT token
    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        dietaryPreferences: user.dietaryPreferences,
        favoriteCuisines: user.favoriteCuisines,
      },
    });
  } catch (error) {
    console.error('[Reset Password Error]', error);
    res.status(500).json({ message: error.message || 'Server error during password reset' });
  }
});

module.exports = router;
