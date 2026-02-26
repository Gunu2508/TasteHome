// config/initDB.js - Creates database tables if they do not exist
const { pool } = require('./db');

const initDB = async () => {
  try {
    // ─── Entity 1: Users ────────────────────────────────────────────────────
    // Stores account credentials; password is always stored as a bcrypt hash
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id          INT AUTO_INCREMENT PRIMARY KEY,
        name        VARCHAR(100)  NOT NULL,
        email       VARCHAR(100)  NOT NULL UNIQUE,
        password    VARCHAR(255)  NOT NULL,
        created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // ─── Entity 2: Recipes (Resource A) ─────────────────────────────────────
    // Main data entity; each recipe belongs to one user (One-to-Many)
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS recipes (
        id            INT AUTO_INCREMENT PRIMARY KEY,
        title         VARCHAR(200)  NOT NULL,
        description   TEXT,
        ingredients   TEXT          NOT NULL,
        instructions  TEXT          NOT NULL,
        category      VARCHAR(100),
        user_id       INT           NOT NULL,
        created_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
        updated_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // ─── Entity 3: Reviews (Resource B) ─────────────────────────────────────
    // Related entity; each review belongs to one recipe AND one user
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS reviews (
        id          INT AUTO_INCREMENT PRIMARY KEY,
        rating      INT           NOT NULL,
        comment     TEXT,
        recipe_id   INT           NOT NULL,
        user_id     INT           NOT NULL,
        created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id)   REFERENCES users(id)   ON DELETE CASCADE
      )
    `);

    console.log('Database tables initialised successfully');
  } catch (error) {
    console.error('Error initialising database tables:', error.message);
    process.exit(1);
  }
};

module.exports = initDB;
