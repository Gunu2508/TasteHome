-- ─────────────────────────────────────────────────────────────────────────────
-- TasteHome Database Schema (PostgreSQL)
-- Tables are also auto-created on startup via config/initDB.js
-- ─────────────────────────────────────────────────────────────────────────────

-- ── Entity 1: Users ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(100) NOT NULL UNIQUE,
  password    VARCHAR(255) NOT NULL,          -- bcrypt hash, never plain text
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ── Entity 2: Recipes (Resource A) ───────────────────────────────────────────
-- Relationship: users (1) ---< recipes (Many)  [One-to-Many via user_id FK]
CREATE TABLE IF NOT EXISTS recipes (
  id            SERIAL PRIMARY KEY,
  title         VARCHAR(200) NOT NULL,
  description   TEXT,
  ingredients   TEXT NOT NULL,
  instructions  TEXT NOT NULL,
  category      VARCHAR(100),
  user_id       INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ── Entity 3: Reviews (Resource B) ───────────────────────────────────────────
-- Relationship: recipes (1) ---< reviews (Many)  [One-to-Many via recipe_id FK]
-- Relationship: users   (1) ---< reviews (Many)  [One-to-Many via user_id FK]
CREATE TABLE IF NOT EXISTS reviews (
  id          SERIAL PRIMARY KEY,
  rating      INT NOT NULL,           -- 1 to 5
  comment     TEXT,
  recipe_id   INT NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  user_id     INT NOT NULL REFERENCES users(id)   ON DELETE CASCADE,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
