const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const app = express();
const port = process.env.PORT || 8080; // You can set the port here or default to 8080

// Import routes
const { carsByPriceRange } = require("./routes");

// Setup middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL connection
const config = require("./config.json");
const connection = mysql.createConnection({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db,
});

connection.connect((err) => {
  if (err) {
    return console.error("error connecting: " + err.stack);
  }
  console.log("connected as id " + connection.threadId);
});

// Use the connection in your route
app.get("/cars_by_price", (req, res) => {
  carsByPriceRange(req, res, connection); // Pass the connection to the function
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
