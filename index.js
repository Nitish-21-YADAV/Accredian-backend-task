require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,   
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false }, 
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed: " + err.stack);
    return;
  }
});

app.post("/refer", (req, res) => {
  const { user_name, user_email, friend_name, friend_email, course_name } = req.body;
  
  if (!user_name || !user_email || !friend_name || !friend_email || !course_name) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const query = "INSERT INTO referral_db (user_name, user_email, friend_name, friend_email, course_name) VALUES (?, ?, ?, ?, ?)";
  
  db.query(query, [user_name, user_email, friend_name, friend_email, course_name], (err, result) => {
    if (err) {
      console.error("Error inserting data: ", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(200).json({ message: "Referral submitted successfully!" }); 
  });
});
app.listen(process.env.PORT, () => {
  console.log(`Server is running `);
});
