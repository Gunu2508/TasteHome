const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",   // put your MySQL password if you have one
  database: "tastehome"
});

db.connect(err => {
  if (err) {
    console.log("Database connection failed", err);
  } else {
    console.log("Connected to TasteHome database");
  }
});

module.exports = db;
