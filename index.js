//import modules
const inquirer = require("inquirer");
const mysql = require("mysql2");
const console = require('console.table');



function initiate() {
  inquirer.prompt([
    {
      type: "list",
      message: "What would you like to do?",
      name: "choice",
      choices: [
        "View All Employees",
        "View All Employee's By Role",
        "View all Emplyees By Deparment",
        "Update Employee",
        "Add Employee",
        "Add Role",
        "Add Department"
      ]
    }
  ]).then(function (input) {
    switch (input.choice) {
      case "View All Employees":
        viewAllEmployees();
        break;

      case "View All Employee's By Role":
        viewAllRoles();
        break;

      case "View all Emplyees By Deparment":
        viewAllDepts();
        break;

      case "Update Employee":
        updateEmployee();
        break;

      case "Add Employee":
        addEmployee();
        break;

      case "Add Role":
        addRole();
        break;

      case "Add Department":
        addDept();
        break;
    }
  })
};

