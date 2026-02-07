const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("TasteHome API is running");
});

// Get all ingredients
app.get("/api/ingredients", (req, res) => {
  db.query("SELECT * FROM ingredients", (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

// Get all stores
app.get("/api/stores", (req, res) => {
  db.query("SELECT * FROM stores", (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Add a new store
app.post("/api/stores", (req, res) => {
  const { name, location } = req.body;
  db.query(
    "INSERT INTO stores (name, location) VALUES (?, ?)",
    [name, location],
    (err, results) => {
      if (err) return res.status(500).send(err);
      res.json({ id: results.insertId, name, location });
    }
  );
});

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Secret key for JWT
const JWT_SECRET = "your_secret_key_here"; // in real projects, use .env file

// Register new user
app.post("/api/auth/register", async (req, res) => {
  const { name, email, password, country, favorite_cuisines } = req.body;
  
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO users (name, email, password, country, favorite_cuisines) VALUES (?, ?, ?, ?, ?)",
    [name, email, hashedPassword, country, favorite_cuisines],
    (err, results) => {
      if (err) return res.status(500).send(err);
      res.json({ message: "User registered successfully", id: results.insertId });
    }
  );
});

// Get all recommendations
app.get("/api/recommendations", (req, res) => {
  db.query("SELECT * FROM recommendations", (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});
