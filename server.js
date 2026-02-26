// server.js - TasteHome API entry point
const dotenv = require('dotenv');
dotenv.config(); // Must be first - loads .env before anything else reads process.env

const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');
const initDB = require('./config/initDB');

// ── Route imports ─────────────────────────────────────────────────────────────
const authRoutes   = require('./routes/authRoutes');
const userRoutes   = require('./routes/userRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const app = express();

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Mount routes ──────────────────────────────────────────────────────────────
app.use('/api/auth',    authRoutes);    // Public  - register & login
app.use('/api/users',   userRoutes);    // Private - user CRUD
app.use('/api/recipes', recipeRoutes);  // Mixed   - public reads, private writes
app.use('/api/reviews', reviewRoutes);  // Mixed   - public reads, private writes

// ── Root health-check ─────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.status(200).json({ message: 'TasteHome API is running' });
});

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

// ── Start server ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB(); // Test DB connection
  await initDB();    // Create tables if they don't exist
  app.listen(PORT, () => {
    console.log(`TasteHome API running on port ${PORT}`);
  });
};

startServer();
