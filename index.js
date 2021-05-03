const inquirer = require("inquirer");
const DB = require("./db");

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
    
}

function viewEmployees() {
    DB.findAllEmployees().then(([rows]) => {
        const employees = rows;
        console.log(employees);
    })
}

mainMenu();