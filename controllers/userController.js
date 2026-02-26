// controllers/userController.js - CRUD operations for the Users entity
const { pool } = require('../config/db');

// @desc    Get all users (password field excluded)
// @route   GET /api/users
// @access  Private
const getUsers = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, created_at FROM users ORDER BY created_at DESC'
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('getUsers error:', error.message);
    res.status(500).json({ message: 'Server error fetching users' });
  }
};

// @desc    Get a single user by ID
// @route   GET /api/users/:id
// @access  Private
const getUserById = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, created_at FROM users WHERE id = $1',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('getUserById error:', error.message);
    res.status(500).json({ message: 'Server error fetching user' });
  }
};

// @desc    Update a user's name or email
// @route   PUT /api/users/:id
// @access  Private
const updateUser = async (req, res) => {
  const { name, email } = req.body;
  if (!name && !email) {
    return res.status(400).json({ message: 'Please provide at least a name or email to update' });
  }
  try {
    const existing = await pool.query(
      'SELECT id, name, email FROM users WHERE id = $1',
      [req.params.id]
    );
    if (existing.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    const current = existing.rows[0];
    const updatedName  = name  || current.name;
    const updatedEmail = email || current.email;

    const result = await pool.query(
      'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING id, name, email, created_at',
      [updatedName, updatedEmail, req.params.id]
    );
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('updateUser error:', error.message);
    res.status(500).json({ message: 'Server error updating user' });
  }
};

// @desc    Delete a user by ID
// @route   DELETE /api/users/:id
// @access  Private
const deleteUser = async (req, res) => {
  try {
    const existing = await pool.query(
      'SELECT id FROM users WHERE id = $1',
      [req.params.id]
    );
    if (existing.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    await pool.query('DELETE FROM users WHERE id = $1', [req.params.id]);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('deleteUser error:', error.message);
    res.status(500).json({ message: 'Server error deleting user' });
  }
};

module.exports = { getUsers, getUserById, updateUser, deleteUser };
