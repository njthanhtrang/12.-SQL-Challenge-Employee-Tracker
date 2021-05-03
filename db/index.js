// get connection
const connection = require("./connection");

// DB commands, ORM
class DB {
  constructor(connection) {
    this.connection = connection;
  }
  findAllDepartments() {
      return 
  }

  findAllEmployees() {
    return this.connection.promise().query("SELECT * FROM employee");
  }
}

module.exports = new DB(connection);
