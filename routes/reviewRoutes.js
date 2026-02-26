// routes/reviewRoutes.js - CRUD routes for Reviews entity
const express = require('express');
const router = express.Router();
const {
  getReviews,
  getReviewById,
  updateReview,
  deleteReview,
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

// GET    /api/reviews       - Read all reviews (public)
router.get('/', getReviews);

// GET    /api/reviews/:id   - Read single review (public)
router.get('/:id', getReviewById);

// PUT    /api/reviews/:id   - Update review (requires JWT)
router.put('/:id', protect, updateReview);

// DELETE /api/reviews/:id   - Delete review (requires JWT)
router.delete('/:id', protect, deleteReview);

module.exports = router;
