// config/initDB.js - Creates database tables if they do not exist
const { pool } = require('./db');

const initDB = async () => {
  try {
    // ─── Entity 1: Users ────────────────────────────────────────────────────
    // Stores account credentials; password is always stored as a bcrypt hash
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id          SERIAL PRIMARY KEY,
        name        VARCHAR(100)  NOT NULL,
        email       VARCHAR(100)  NOT NULL UNIQUE,
        password    VARCHAR(255)  NOT NULL,
        created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // ─── Entity 2: Recipes (Resource A) ─────────────────────────────────────
    // Main data entity; each recipe belongs to one user (One-to-Many)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS recipes (
        id            SERIAL PRIMARY KEY,
        title         VARCHAR(200)  NOT NULL,
        description   TEXT,
        ingredients   TEXT          NOT NULL,
        instructions  TEXT          NOT NULL,
        category      VARCHAR(100),
        user_id       INT           NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
        updated_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // ─── Entity 3: Reviews (Resource B) ─────────────────────────────────────
    // Related entity; each review belongs to one recipe AND one user
    await pool.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id          SERIAL PRIMARY KEY,
        rating      INT           NOT NULL,
        comment     TEXT,
        recipe_id   INT           NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
        user_id     INT           NOT NULL REFERENCES users(id)   ON DELETE CASCADE,
        created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Database tables initialised successfully');
  } catch (error) {
    console.error('Error initialising database tables:', error.message);
    process.exit(1);
  }
};

module.exports = initDB;
