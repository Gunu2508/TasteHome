// controllers/reviewController.js - CRUD operations for the Reviews entity
const { pool } = require('../config/db');

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get all reviews (joined with reviewer name and recipe title)
// @route   GET /api/reviews
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
const getReviews = async (req, res) => {
  try {
    const [reviews] = await pool.execute(`
      SELECT rv.id, rv.rating, rv.comment, rv.recipe_id, rv.user_id,
             u.name  AS reviewer_name,
             r.title AS recipe_title,
             rv.created_at
      FROM   reviews rv
      JOIN   users   u ON rv.user_id   = u.id
      JOIN   recipes r ON rv.recipe_id = r.id
      ORDER  BY rv.created_at DESC
    `);

    res.status(200).json(reviews);
  } catch (error) {
    console.error('getReviews error:', error.message);
    res.status(500).json({ message: 'Server error fetching reviews' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get a single review by ID
// @route   GET /api/reviews/:id
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
const getReviewById = async (req, res) => {
  try {
    const [reviews] = await pool.execute(`
      SELECT rv.id, rv.rating, rv.comment, rv.recipe_id, rv.user_id,
             u.name  AS reviewer_name,
             r.title AS recipe_title,
             rv.created_at
      FROM   reviews rv
      JOIN   users   u ON rv.user_id   = u.id
      JOIN   recipes r ON rv.recipe_id = r.id
      WHERE  rv.id = ?
    `, [req.params.id]);

    if (reviews.length === 0) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.status(200).json(reviews[0]);
  } catch (error) {
    console.error('getReviewById error:', error.message);
    res.status(500).json({ message: 'Server error fetching review' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get all reviews for a specific recipe
// @route   GET /api/recipes/:recipeId/reviews
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
const getReviewsByRecipe = async (req, res) => {
  try {
    const [reviews] = await pool.execute(`
      SELECT rv.id, rv.rating, rv.comment, rv.recipe_id, rv.user_id,
             u.name AS reviewer_name,
             rv.created_at
      FROM   reviews rv
      JOIN   users   u ON rv.user_id = u.id
      WHERE  rv.recipe_id = ?
      ORDER  BY rv.created_at DESC
    `, [req.params.recipeId]);

    res.status(200).json(reviews);
  } catch (error) {
    console.error('getReviewsByRecipe error:', error.message);
    res.status(500).json({ message: 'Server error fetching reviews for recipe' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Create a new review for a recipe
// @route   POST /api/recipes/:recipeId/reviews
// @access  Private
// ─────────────────────────────────────────────────────────────────────────────
const createReview = async (req, res) => {
  const { rating, comment } = req.body;
  const { recipeId } = req.params;

  if (!rating) {
    return res.status(400).json({ message: 'Rating is required' });
  }

  const parsedRating = parseInt(rating);
  if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
    return res.status(400).json({ message: 'Rating must be a number between 1 and 5' });
  }

  try {
    // Verify the recipe exists before attaching a review
    const [recipes] = await pool.execute(
      'SELECT id FROM recipes WHERE id = ?',
      [recipeId]
    );

    if (recipes.length === 0) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    const [result] = await pool.execute(
      'INSERT INTO reviews (rating, comment, recipe_id, user_id) VALUES (?, ?, ?, ?)',
      [parsedRating, comment || null, recipeId, req.user.id]
    );

    const [newReview] = await pool.execute(
      'SELECT * FROM reviews WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json(newReview[0]);
  } catch (error) {
    console.error('createReview error:', error.message);
    res.status(500).json({ message: 'Server error creating review' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Update a review (only the author can update)
// @route   PUT /api/reviews/:id
// @access  Private
// ─────────────────────────────────────────────────────────────────────────────
const updateReview = async (req, res) => {
  const { rating, comment } = req.body;

  try {
    const [reviews] = await pool.execute(
      'SELECT * FROM reviews WHERE id = ?',
      [req.params.id]
    );

    if (reviews.length === 0) {
      return res.status(404).json({ message: 'Review not found' });
    }

    const review = reviews[0];

    // Only the review author can update
    if (review.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this review' });
    }

    const newRating = rating ? parseInt(rating) : review.rating;

    await pool.execute(
      'UPDATE reviews SET rating = ?, comment = ? WHERE id = ?',
      [
        newRating,
        comment !== undefined ? comment : review.comment,
        req.params.id,
      ]
    );

    const [updated] = await pool.execute(
      'SELECT * FROM reviews WHERE id = ?',
      [req.params.id]
    );

    res.status(200).json(updated[0]);
  } catch (error) {
    console.error('updateReview error:', error.message);
    res.status(500).json({ message: 'Server error updating review' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Delete a review (only the author can delete)
// @route   DELETE /api/reviews/:id
// @access  Private
// ─────────────────────────────────────────────────────────────────────────────
const deleteReview = async (req, res) => {
  try {
    const [reviews] = await pool.execute(
      'SELECT * FROM reviews WHERE id = ?',
      [req.params.id]
    );

    if (reviews.length === 0) {
      return res.status(404).json({ message: 'Review not found' });
    }

    const review = reviews[0];

    // Only the review author can delete
    if (review.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    await pool.execute('DELETE FROM reviews WHERE id = ?', [req.params.id]);

    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('deleteReview error:', error.message);
    res.status(500).json({ message: 'Server error deleting review' });
  }
};

module.exports = {
  getReviews,
  getReviewById,
  getReviewsByRecipe,
  createReview,
  updateReview,
  deleteReview,
};
