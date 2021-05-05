const inquirer = require("inquirer");
const db = require("./db");
const cTable = require("console.table");
const { findAllDepartments } = require("./db");

const mainMenu = async () => {
  const answer = await inquirer.prompt([
    {
      type: "list",
      name: "menu",
      message: "What would you like to do?",
      choices: [
        "View all departments",
        "View all roles",
        "View all employees",
        "Add a department",
        "Add a role",
        "Add an employee",
        "Update an employee role",
        // bonus
        // "Update employee managers",
        // "View employees by manager",
        // "View employees by department",
        // "Delete a department",
        // "Delete a role",
        // "Delete an employee",
        // "Exit",
      ],
    },
  ]);
  switch (answer.menu) {
    case "View all departments":
      return viewDepartments();
    case "View all roles":
      return viewRoles();
    case "View all employees":
      return viewEmployees();
    case "Add a department":
      return addDepartment();
    case "Add a role":
      return addRole();
    case "Add an employee":
      return addEmployee();
    case "Update an employee role":
      return updateEmployee();
    case "Exit":
      console.log("Bye!");
      break;
  }
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
  console.log("answer", answer);
  console.log("answer.name", answer.name);
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
  const departmentChoices = rows.map(({ name}) => ({ name, value: id }));
  console.log(departmentChoices);
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
  console.log("answer", answer);
  console.log("answer.name", answer.name);

  db.addARole(answer.name, answer.salary, answer.department).then(() => {
    db.findAllRoles().then(([rows]) => {
      console.table(rows);
      return mainMenu();
    });
  });
};

const addEmployee = async () => {
  const [rowsA] = await db.findAllRoles();
  console.table(rowsA);
  const roleChoices = rowsA.map(({ title, salary }) => ({ title, salary }));
  console.log(roleChoices);

  const [rowsB] = await db.findAllEmployees();
  const employeeChoices = rowsB.map(({ first_name, last_name }) => ({ first_name, last_name}));
  console.log(employeeChoices);
  const answer = await inquirer.prompt([
    {
      type: "input",
      name: "firstName",
      message: "What is the employee's first name?",
      validate: validateInput,
    },
    {
      type: "input",
      name: "lastName",
      message: "What is the employee's last name?",
      validate: validateInput,
    },
    {
      type: "list",
      name: "role",
      message: "What is this employee's role?",
      choices: roleChoices,
    },
    {
      type: "list",
      name: "manager",
      message: "Who is this employee's manager?",
      choices: employeeChoices,
    },
  ]);
  db.addAnEmployee(
    answer.firstName,
    answer.lastName,
    answer.role,
    answer.manager
  ).then(() => {
    db.findAllEmployees().then(([rows]) => {
      console.table(rows);
      return mainMenu();
    });
  });
};

mainMenu();
