// config/db.js - PostgreSQL connection pool (Render)
const { Pool } = require('pg');

// Render auto-injects DATABASE_URL when you link a Postgres DB to your web service
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // required for Render hosted PostgreSQL
});

// Test the database connection on startup
const connectDB = async () => {
  try {
    await pool.query('SELECT 1');
    console.log('PostgreSQL database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = { pool, connectDB };
