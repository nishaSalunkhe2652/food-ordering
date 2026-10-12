
const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "food_ordering",
});

db.connect((err) => {
  if (err) {
    console.log("MySQL connection failed:", err.message);
    return;
  }

  console.log("MySQL database connected successfully!");
});

module.exports = db;
