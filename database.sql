-- ─────────────────────────────────────────────────────────────────────────────
-- TasteHome Database Schema
-- Run this script manually in Aiven (or any MySQL client) to create the tables.
-- The application will also auto-create these tables on first startup via initDB.js
-- ─────────────────────────────────────────────────────────────────────────────

-- ── Entity 1: Users ───────────────────────────────────────────────────────────
-- Stores user credentials. Passwords are ALWAYS stored as bcrypt hashes.
CREATE TABLE IF NOT EXISTS users (
  id          INT          AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(100) NOT NULL UNIQUE,
  password    VARCHAR(255) NOT NULL,          -- bcrypt hash, never plain text
  created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- ── Entity 2: Recipes (Resource A) ───────────────────────────────────────────
-- Main data entity. Each recipe belongs to one user.
-- Relationship: users (1) ---< recipes (Many)  [One-to-Many via user_id FK]
CREATE TABLE IF NOT EXISTS recipes (
  id            INT          AUTO_INCREMENT PRIMARY KEY,
  title         VARCHAR(200) NOT NULL,
  description   TEXT,
  ingredients   TEXT         NOT NULL,
  instructions  TEXT         NOT NULL,
  category      VARCHAR(100),
  user_id       INT          NOT NULL,
  created_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ── Entity 3: Reviews (Resource B) ───────────────────────────────────────────
-- Related entity. Each review belongs to one recipe AND one user.
-- Relationship: recipes (1) ---< reviews (Many)  [One-to-Many via recipe_id FK]
-- Relationship: users   (1) ---< reviews (Many)  [One-to-Many via user_id FK]
CREATE TABLE IF NOT EXISTS reviews (
  id          INT       AUTO_INCREMENT PRIMARY KEY,
  rating      INT       NOT NULL,          -- 1 to 5
  comment     TEXT,
  recipe_id   INT       NOT NULL,
  user_id     INT       NOT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id)   REFERENCES users(id)   ON DELETE CASCADE
);
