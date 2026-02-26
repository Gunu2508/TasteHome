// routes/userRoutes.js - Private CRUD routes for Users entity
const express = require('express');
const router = express.Router();
const { getUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// GET    /api/users       - Read all users (requires JWT)
router.get('/', protect, getUsers);

// GET    /api/users/:id   - Read single user (requires JWT)
router.get('/:id', protect, getUserById);

// PUT    /api/users/:id   - Update user (requires JWT)
router.put('/:id', protect, updateUser);

// DELETE /api/users/:id   - Delete user (requires JWT)
router.delete('/:id', protect, deleteUser);

module.exports = router;
