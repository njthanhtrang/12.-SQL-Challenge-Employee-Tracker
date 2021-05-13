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
    return this.connection
      .promise()
      .query(
        "SELECT roles.id, roles.title, roles.salary, department.name AS department FROM roles LEFT JOIN department ON roles.department_id = department.id"
      );
  }
  findAllEmployees() {
    return this.connection.promise()
    .query(`SELECT
    employee.id, employee.first_name, employee.last_name, roles.title, department.name AS department, roles.salary, CONCAT(manager.first_name, ' ' , manager.last_name) AS manager
    FROM
    employee LEFT JOIN roles ON employee.role_id = roles.id LEFT JOIN department ON roles.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id`);
}
addADepartment(departmentName) {
    return this.connection
      .promise()
      .query("INSERT INTO department (name) VALUES (?)", [departmentName]);
  }
  addARole(roleTitle, roleSalary, roleDepartmentId) {
    return this.connection
      .promise()
      .query(
        "INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)",
        [roleTitle, roleSalary, roleDepartmentId]
      );
  }
  addAnEmployee(answer) {
    return this.connection
      .promise()
      .query("INSERT INTO employee SET ?", answer);
  }
  updateAnEmployeeRole(roleId, employeeId) {
    return this.connection
      .promise()
      .query("UPDATE employee SET role_id = ? WHERE id = ?", [
        roleId,
        employeeId,
      ]);
  }
  updateAnEmployeeManager(managerId, employeeId) {
    return this.connection
      .promise()
      .query("UPDATE employee SET employee.manager_id = ? WHERE id = ?", [managerId, employeeId]);
  }  
  findAllManagers(employeeId) {
      return this.connection.promise().query("SELECT * FROM employee WHERE id != ?", [employeeId]);
  }
  findByManager(managerId) {
    return this.connection.promise().query("SELECT * FROM employee WHERE manager_id = ?", [managerId]);
  }

//   SQL query not working
  findByDepartment(departmentId) {
    return this.connection.promise().query("SELECT * FROM roles WHERE department_id = ?", [departmentId]);
  }
  deleteADepartment(departmentId) {
    return this.connection.promise().query("DELETE FROM department WHERE id = ?", [departmentId]);
  }
  deleteARole(roleId) {
    return this.connection.promise().query("DELETE FROM roles WHERE id = ?", [roleId]); 
  }
  deleteAnEmployee(roleId) {
    return this.connection.promise().query("DELETE FROM department WHERE id = ?", [roleId]);
  }
}

module.exports = new db(connection);
