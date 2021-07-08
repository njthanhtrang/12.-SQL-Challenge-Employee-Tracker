const inquirer = require("inquirer");
const db = require("./db");
require("console.table");

const exit = () => {
  console.log("Bye!");
  process.exit(0);
};
const mainMenu = async () => {
  const answer = await inquirer.prompt([
    {
      type: "list",
      name: "menu",
      message: "What would you like to do?",
      choices: [
        { name: "View all departments", value: viewDepartments },
        { name: "View all roles", value: viewRoles },
        { name: "View all employees", value: viewEmployees },
        { name: "Add a department", value: addDepartment },
        { name: "Add a role", value: addRole },
        { name: "Add an employee", value: addEmployee },
        { name: "Update an employee role", value: updateEmployeeRole },
        { name: "Update employee manager", value: updateEmployeeManager },
        { name: "View employees by manager", value: viewByManager },
        { name: "View employees by department", value: viewByDepartment },
        { name: "Delete a department", value: deleteDepartment },
        { name: "Delete a role", value: deleteRole },
        { name: "Delete an employee", value: deleteEmployee },
        { name: "View total utilized budget by department", value: budgetByDepartment},
        { name: "Exit", value: exit },
      ],
    },
  ]);

  answer.menu();

  //   switch (answer.menu) {
  //     case "View all departments":
  //       return viewDepartments();
  //     case "View all roles":
  //       return viewRoles();
  //     case "View all employees":
  //       return viewEmployees();
  //     case "Add a department":
  //       return addDepartment();
  //     case "Add a role":
  //       return addRole();
  //     case "Add an employee":
  //       return addEmployee();
  //     case "Update an employee role":
  //       return updateEmployeeRole();
  //     case "Update employee manager":
  //       return updateEmployeeManager();
  //     case "View employees by manager":
  //       return viewByManager();
  //     case "Exit":
  //       console.log("Bye!");
  //       break;
  //   }
};

function viewDepartments() {
  db.findAllDepartments().then(([rows]) => {
    console.table(rows);
    return mainMenu();
  });
}

function viewEmployees() {
  db.findAllEmployees().then(([rows]) => {
    console.table(rows);
    return mainMenu();
  });
}

function viewRoles() {
  db.findAllRoles().then(([rows]) => {
    console.table(rows);
    return mainMenu();
  });
}

function validateInput(value) {
  if (value) {
    return true;
  } else {
    console.log("\n Please enter a value");
    return false;
  }
}

const addDepartment = async () => {
  const answer = await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "What is the department name?",
      validate: validateInput,
    },
  ]);
  // console.log("answer", answer);
  // console.log("answer.name", answer.name);
  const departmentName = answer.name;
  db.addADepartment(departmentName).then(() => {
    db.findAllDepartments().then(([rows]) => {
      console.table(rows);
      return mainMenu();
    });
  });
};

const addRole = async () => {
  // same as .then() above, gives us a Tuple
  const [rows] = await db.findAllDepartments();
  console.table(rows);
  const departmentChoices = rows.map(({ name, id }) => ({ name, value: id }));
  // console.log(departmentChoices);
  const answer = await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "What is the role title?",
      validate: validateInput,
    },
    {
      type: "input",
      name: "salary",
      message: "What is the salary for this role?",
      validate: validateInput,
    },
    {
      type: "list",
      name: "department",
      message: "Which department does this role belong to?",
      choices: departmentChoices,
    },
  ]);
  // console.log("answer", answer);
  // console.log("answer.name", answer.name);

  db.addARole(answer.name, answer.salary, answer.department).then(() => {
    db.findAllRoles().then(([rows]) => {
      console.table(rows);
      return mainMenu();
    });
  });
};

function mapEmployeeChoices({ id, name }) {
  return { name, value: id };
}

const addEmployee = async () => {
  const [rowsA] = await db.findAllRoles();
  console.table(rowsA);
  const roleChoices = rowsA.map(({ id, title }) => ({
    name: title,
    value: id,
  }));
  console.log(roleChoices);

  //   immutability
  const [rowsB] = await db.findAllEmployees();
  const employeeChoices = rowsB.map(mapEmployeeChoices);
  console.log(employeeChoices);

  const managerChoices = [...employeeChoices, { name: "Null" }];
  console.log(managerChoices);
  const answer = await inquirer.prompt([
    {
      type: "input",
      name: "first_name",
      message: "What is the employee's first name?",
      validate: validateInput,
    },
    {
      type: "input",
      name: "last_name",
      message: "What is the employee's last name?",
      validate: validateInput,
    },
    {
      type: "list",
      name: "role_id",
      message: "What is this employee's role?",
      choices: roleChoices,
    },
    {
      type: "confirm",
      name: "managerOrNot",
      message: "Does this employee have a manager?",
      default: true,
    },
    {
      type: "list",
      name: "manager_id",
      when: function (answers) {
        return answers.managerOrNot === true;
      },
      message: "Who is this employee's manager?",
      choices: managerChoices,
    },
  ]);
  delete answer.managerOrNot;
  console.log(answer);
  db.addAnEmployee(answer).then(() => {
    db.findAllEmployees().then(([rows]) => {
      console.table(rows);
      return mainMenu();
    });
  });
};

const updateEmployeeRole = async () => {
  const [rowsA] = await db.findAllRoles();
  console.table(rowsA);
  const roleChoices = rowsA.map(({ id, title }) => ({
    name: title,
    value: id,
  }));
  console.log(roleChoices);

  const [rowsB] = await db.findAllEmployees();
  const employeeChoices = rowsB.map(mapEmployeeChoices);
  console.log(employeeChoices);
  const answer = await inquirer.prompt([
    {
      type: "list",
      name: "employee",
      message: "Which employee's role do you want to update?",
      choices: employeeChoices,
    },
    {
      type: "list",
      name: "role",
      message: "What is this employee's new role?",
      choices: roleChoices,
    },
  ]);
  console.log(answer);
  db.updateAnEmployeeRole(answer.role, answer.employee).then(() => {
    db.findAllEmployees().then(([rows]) => {
      console.table(rows);
      return mainMenu();
    });
  });
};

const updateEmployeeManager = async () => {
  const [rowsB] = await db.findAllEmployees();
  const employeeChoices = rowsB.map(mapEmployeeChoices);
  console.log(employeeChoices);
  const { employee } = await inquirer.prompt([
    {
      type: "list",
      name: "employee",
      message: "Which employee's manager do you want to update?",
      choices: employeeChoices,
    },
  ])
  const [managerRows] = await db.findAllManagers(employee);
  console.table(managerRows);
  const managerChoices = managerRows.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id
  }));
  //   update manager choices, not immutable
  managerChoices.push({ name: "No manager selected", value: null });
  //   renaming destructured property manager as data
  //   const {manager:data} = await inquirer.prompt([
  //   destructuring property and defining as variable
  const { manager } = await inquirer.prompt([
    {
      type: "list",
      name: "manager",
      message: "Who is this employee's new manager?",
      choices: managerChoices,
    },
  ]);
  db.updateAnEmployeeManager(manager, employee).then(() => {
    db.findAllEmployees().then(([rows]) => {
      console.table(rows);
      return mainMenu();
    });
  });
};

const viewByManager = async () => {
  const [allEmployees] = await db.findAllEmployees();
  const managerChoices = allEmployees.map(mapEmployeeChoices);
  const { manager } = await inquirer.prompt([
    {
      type: "list",
      name: "manager",
      message: "Which manager's employees do you want to see?",
      choices: managerChoices,
    },
  ]);
  const [managersEmployees] = await db.findByManager(manager);
  console.table(managersEmployees);
  return mainMenu();
};

const viewByDepartment = async () => {
  const [allDepartments] = await db.findAllDepartments();
  console.table(allDepartments);
  const departmentChoices = allDepartments.map(({ id, name }) => ({
    name: name,
    value: id,
  }));
  const { department } = await inquirer.prompt([
    {
      type: "list",
      name: "department",
      message: "Which department's employees do you want to see?",
      choices: departmentChoices,
    },
  ]);
  const [departmentEmployees] = await db.findByDepartment(department);
  console.table(departmentEmployees);
  return mainMenu();
};

const deleteDepartment = async () => {
  const [allDepartments] = await db.findAllDepartments();
  console.table(allDepartments);
  const departmentChoices = allDepartments.map(({ id, name }) => ({
    name: name,
    value: id,
  }));
  console.table(departmentChoices);
  const { department } = await inquirer.prompt([
    {
      type: "list",
      name: "department",
      message: "Which department do you want to delete?",
      choices: departmentChoices,
    },
  ]);
  //   const [updatedDepartments] = await db.deleteADepartment(department);
  //   console.table(updatedDepartments);
  //   return mainMenu();

  db.deleteADepartment(department).then(() => {
    db.findAllDepartments().then(([rows]) => {
      console.table(rows);
      return mainMenu();
    });
  });
};

const deleteRole = async () => {
  const [rowsA] = await db.findAllRoles();
  console.table(rowsA);
  const roleChoices = rowsA.map(({ id, title }) => ({
    name: title,
    value: id,
  }));
  console.log(roleChoices);
  const response = await inquirer
    .prompt([
      {
        type: "list",
        name: "role",
        message: "Which role do you want to delete?",
        choices: roleChoices,
      },
    ])
    .then((response) => {
      db.deleteARole(response.role);
        db.findAllRoles().then(([rows]) => {
            console.table(rows);
            return mainMenu();
        });
    });
};

const deleteEmployee = async () => {
  const [rowsA] = await db.findAllEmployees();
  console.table(rowsA);
  const employeeChoices = rowsA.map(({ id, name }) => ({ name,
    value: id,
  }));
  console.table(employeeChoices);
  const response = await inquirer.prompt([
    {
      type: "list",
      name: "employee",
      message: "Which employee do you want to delete?",
      choices: employeeChoices,
    },
  ])
  .then((response) => {
    db.deleteAnEmployee(response.employee);
      db.findAllEmployees().then(([rows]) => {
          console.table(rows);
          return mainMenu();
      });
  });
};

const budgetByDepartment = async () => {

  const [departmentBudget] = await db.findDepartmentBudget();
  console.table(departmentBudget);
  return mainMenu();
}

mainMenu();
