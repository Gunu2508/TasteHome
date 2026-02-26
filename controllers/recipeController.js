// controllers/recipeController.js - CRUD operations for the Recipes entity
const { pool } = require('../config/db');

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get all recipes (joined with author name)
// @route   GET /api/recipes
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
const getRecipes = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT r.id, r.title, r.description, r.ingredients, r.instructions,
             r.category, r.user_id, u.name AS author_name,
             r.created_at, r.updated_at
      FROM   recipes r
      JOIN   users   u ON r.user_id = u.id
      ORDER  BY r.created_at DESC
    `);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('getRecipes error:', error.message);
    res.status(500).json({ message: 'Server error fetching recipes' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get a single recipe by ID
// @route   GET /api/recipes/:id
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
const getRecipeById = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT r.id, r.title, r.description, r.ingredients, r.instructions,
             r.category, r.user_id, u.name AS author_name,
             r.created_at, r.updated_at
      FROM   recipes r
      JOIN   users   u ON r.user_id = u.id
      WHERE  r.id = $1
    `, [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('getRecipeById error:', error.message);
    res.status(500).json({ message: 'Server error fetching recipe' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Create a new recipe
// @route   POST /api/recipes
// @access  Private
// ─────────────────────────────────────────────────────────────────────────────
const createRecipe = async (req, res) => {
  const { title, description, ingredients, instructions, category } = req.body;

  if (!title || !ingredients || !instructions) {
    return res.status(400).json({
      message: 'Please provide title, ingredients, and instructions',
    });
  }

  try {
    // RETURNING * gives us the new row without a second query
    const result = await pool.query(
      `INSERT INTO recipes (title, description, ingredients, instructions, category, user_id)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [title, description || null, ingredients, instructions, category || null, req.user.id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('createRecipe error:', error.message);
    res.status(500).json({ message: 'Server error creating recipe' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Update an existing recipe (only the owner can update)
// @route   PUT /api/recipes/:id
// @access  Private
// ─────────────────────────────────────────────────────────────────────────────
const updateRecipe = async (req, res) => {
  const { title, description, ingredients, instructions, category } = req.body;

  try {
    const existing = await pool.query(
      'SELECT * FROM recipes WHERE id = $1',
      [req.params.id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    const recipe = existing.rows[0];

    // Only the recipe owner is allowed to update
    if (recipe.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this recipe' });
    }

    const result = await pool.query(
      `UPDATE recipes
       SET title = $1, description = $2, ingredients = $3,
           instructions = $4, category = $5, updated_at = CURRENT_TIMESTAMP
       WHERE id = $6 RETURNING *`,
      [
        title        || recipe.title,
        description  !== undefined ? description  : recipe.description,
        ingredients  || recipe.ingredients,
        instructions || recipe.instructions,
        category     !== undefined ? category     : recipe.category,
        req.params.id,
      ]
    );

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('updateRecipe error:', error.message);
    res.status(500).json({ message: 'Server error updating recipe' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Delete a recipe (only the owner can delete)
// @route   DELETE /api/recipes/:id
// @access  Private
// ─────────────────────────────────────────────────────────────────────────────
const deleteRecipe = async (req, res) => {
  try {
    const existing = await pool.query(
      'SELECT * FROM recipes WHERE id = $1',
      [req.params.id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    const recipe = existing.rows[0];

    // Only the recipe owner is allowed to delete
    if (recipe.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this recipe' });
    }

    await pool.query('DELETE FROM recipes WHERE id = $1', [req.params.id]);

    res.status(200).json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    console.error('deleteRecipe error:', error.message);
    res.status(500).json({ message: 'Server error deleting recipe' });
  }
};

module.exports = { getRecipes, getRecipeById, createRecipe, updateRecipe, deleteRecipe };
