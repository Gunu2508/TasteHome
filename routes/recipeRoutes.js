// routes/recipeRoutes.js - CRUD routes for Recipes entity + nested review routes
const express = require('express');
const router = express.Router();
const {
  getRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} = require('../controllers/recipeController');
const { getReviewsByRecipe, createReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

// GET    /api/recipes               - Read all recipes (public)
router.get('/', getRecipes);

// GET    /api/recipes/:id           - Read single recipe (public)
router.get('/:id', getRecipeById);

// POST   /api/recipes               - Create recipe (requires JWT)
router.post('/', protect, createRecipe);

// PUT    /api/recipes/:id           - Update recipe (requires JWT)
router.put('/:id', protect, updateRecipe);

// DELETE /api/recipes/:id           - Delete recipe (requires JWT)
router.delete('/:id', protect, deleteRecipe);

// ── Nested review routes for a specific recipe ────────────────────────────────
// GET    /api/recipes/:recipeId/reviews  - Get all reviews for a recipe (public)
router.get('/:recipeId/reviews', getReviewsByRecipe);

// POST   /api/recipes/:recipeId/reviews  - Add review to a recipe (requires JWT)
router.post('/:recipeId/reviews', protect, createReview);

module.exports = router;
