//import modules
const inquirer = require("inquirer");
const mysql = require("mysql2");
const consoleTable = require('console.table');

require('dotenv').config();

var roleArr = [];
var managerArr = [];

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PW,
  database: process.env.DB_NAME
});

connection.connect(function (err) {
  if (err) {
    throw err;
  }
  console.log('Connected to' + connection.threadId)
  initiatePrompt();
});


function initiatePrompt() {
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



function viewAllEmployees() {
  connection.query("SELECT employee.first_name, employee.last_name, role.title, role.salary, department.name, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id left join employee e on employee.manager_id = e.id;",
    function (err, res) {
      if (err) {
        throw err
      }
      console.table(res)
      initiatePrompt();
    })
};

function viewAllRoles() {
  connection.query('SELECT employee.first_name, employee.last_name, role.title AS Title FROM employee JOIN role ON employee.role_id = role.id;',
    function (err, res) {
      if (err) {
        throw err;
      }
      console.table(res);
      initiatePrompt();
    })
};

function viewAllDepts() {
  connection.query('SELECT employee.first_name, employee.last_name, department.name AS Department FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY employee.id;',
    function (err, res) {
      if (err) {
        throw err;
      }
      console.table(res);
      initiatePrompt();
    })
};









