const inquirer = require("inquirer");
const DB = require("./db");
const cTable = require("console.table");

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
        "Update employee managers",
        "View employees by manager",
        "View employees by department",
        "Delete a department",
        "Delete a role",
        "Delete an employee",
        "Exit"
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

function viewDepartments()  {
    DB.findAllDepartments().then(([rows]) => {
        const departments = rows;
        console.table(departments);
        return mainMenu();
    });
};

function viewEmployees() {
    DB.findAllEmployees().then(([rows]) => {
        const employees = rows;
        console.table(employees);
        return mainMenu();
    });
};

function viewRoles() {
    DB.findAllRoles().then(([rows]) => {
        const roles = rows;
        console.table(roles);
        return mainMenu();
    });
};

const addDepartment = async () => {
    const answer = await inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "What is the department name? (Required)",
            validate: validateDepartment
          },
    ])
    answer.name = departmentName;
    DB.addADepartment(departmentName).then(([rows]) => {
        const addedDepartment = rows;
        console.table(addedDepartment);
        return mainMenu;
    });
}


function validateDepartment(name) {
    if (name) {
        return true;
    } else {
        console.log("\n Please enter a department name");
        return false;
    }
}

mainMenu();