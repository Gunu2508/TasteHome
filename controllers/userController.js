// controllers/userController.js - CRUD operations for the Users entity
const { pool } = require('../config/db');

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get all users (password field excluded)
// @route   GET /api/users
// @access  Private
// ─────────────────────────────────────────────────────────────────────────────
const getUsers = async (req, res) => {
  try {
    const [users] = await pool.execute(
      'SELECT id, name, email, created_at FROM users ORDER BY created_at DESC'
    );
    res.status(200).json(users);
  } catch (error) {
    console.error('getUsers error:', error.message);
    res.status(500).json({ message: 'Server error fetching users' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get a single user by ID
// @route   GET /api/users/:id
// @access  Private
// ─────────────────────────────────────────────────────────────────────────────
const getUserById = async (req, res) => {
  try {
    const [users] = await pool.execute(
      'SELECT id, name, email, created_at FROM users WHERE id = ?',
      [req.params.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(users[0]);
  } catch (error) {
    console.error('getUserById error:', error.message);
    res.status(500).json({ message: 'Server error fetching user' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Update a user's name or email
// @route   PUT /api/users/:id
// @access  Private
// ─────────────────────────────────────────────────────────────────────────────
const updateUser = async (req, res) => {
  const { name, email } = req.body;

  if (!name && !email) {
    return res.status(400).json({ message: 'Please provide at least a name or email to update' });
  }

  try {
    // Check the user exists
    const [users] = await pool.execute(
      'SELECT id, name, email FROM users WHERE id = ?',
      [req.params.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const current = users[0];

    // Use existing values as fallback if a field is not provided
    const updatedName = name || current.name;
    const updatedEmail = email || current.email;

    await pool.execute(
      'UPDATE users SET name = ?, email = ? WHERE id = ?',
      [updatedName, updatedEmail, req.params.id]
    );

    const [updated] = await pool.execute(
      'SELECT id, name, email, created_at FROM users WHERE id = ?',
      [req.params.id]
    );

    res.status(200).json(updated[0]);
  } catch (error) {
    console.error('updateUser error:', error.message);
    res.status(500).json({ message: 'Server error updating user' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Delete a user by ID
// @route   DELETE /api/users/:id
// @access  Private
// ─────────────────────────────────────────────────────────────────────────────
const deleteUser = async (req, res) => {
  try {
    const [users] = await pool.execute(
      'SELECT id FROM users WHERE id = ?',
      [req.params.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    await pool.execute('DELETE FROM users WHERE id = ?', [req.params.id]);

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('deleteUser error:', error.message);
    res.status(500).json({ message: 'Server error deleting user' });
  }
};

module.exports = { getUsers, getUserById, updateUser, deleteUser };
