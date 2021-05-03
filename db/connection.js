const mysql = require("mysql2");

// Connect to election database
const connection = mysql.createConnection(
    {
      host: "localhost",
      // Your MySQL username,
      user: "root",
      // Your MySQL password
      password: "sentireasons",
      database: "company",
    });

module.exports = connection;