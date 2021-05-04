// get connection
const connection = require("./connection");

// DB commands, ORM
class db {
  constructor(connection) {
    this.connection = connection;
  }
  findAllDepartments() {
    return this.connection.promise().query("SELECT * FROM department");
  }
  findAllRoles() {
    return this.connection.promise().query("SELECT * FROM roles");
  }
  findAllEmployees() {
    return this.connection.promise().query("SELECT * FROM employee");
  }
  addADepartment(departmentName) {
      return this.connection.promise().query("INSERT INTO department (name) VALUES (?)", [departmentName]);
  }

}

module.exports = new db(connection);
