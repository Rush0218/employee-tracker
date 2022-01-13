//import modules
const inquirer = require("inquirer");
const mysql = require("mysql2");
const consoleTable = require('console.table');
const e = require("express");

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

function selectRole() {
  connection.query('SELECT * FROM role', function (err, res) {
    if (err) {
      throw err;
    } else {
      for (var i = 0; i < res.length; i++) {
        roleArr.push(res[i].title);
      }
    }
  })
  return roleArr;
};

function selectManager() {
  connection.query('SELECT first_name, last_name FROM employee WHERE manager_id IS NULL', function (err, res) {
    if (err) {
      throw err;
    } else {
      for (var i = 0; i < res.length; i++) {
        managerArr.push(res[i].title);
      }
    }
  })
  return managerArr;
};


//create function to add new employees 
function addEmployee() {
  inquirer.prompt([
    {
      name: "firstname",
      type: "input",
      message: "Please enter employee's first name."
    },
    {
      name: "firstname",
      type: "input",
      message: "Please enter employee's last name."
    },
    {
      name: "role",
      type: "list",
      message: "Please select the employee's role.",
      choices: selectRole()
    },
    {
      name: "choice",
      type: "rawlist",
      message: "Please select the employee's manager.",
      choices: selectManager()
    }
  ]).then(function (input) {
    var roleId = selectRole().indexOf(input.role) + 1;
    var managerId = selectManager().indexOf(input.choice) + 1;
    connection.query("INSERT INTO employee SET ?",
      {
        first_name: input.firstName,
        last_name: input.lastName,
        role_id: roleId,
        manager_id: managerId
      },
      function (err) {
        if (err) {
          throw err;
        } else {
          console.log(input);
          initiatePrompt();
        }
      })
  })
};

//create a function that allows users to update employee information
function updateEmployee() {
  connection.query("SELECT employee.last_name, role.title FROM employee JOIN role ON employee.role_id = role.id;",
    function (err, res) {
      if (err) {
        throw err;
      } else {
        console.log(res)
        inquirer.prompt([
          {
            name: 'lastName',
            type: 'rawlist',
            choices: function () {
              var lastName = [];
              for (var i = 0; i < res.length; i++) {
                lastName.push(res[i].last_name);
              }
              return lastName;
            },
            message: "Please provide the employee's last name."
          },
          {
            name: 'role',
            type: 'rawlist',
            message: 'Please select their new title.',
            selectRole();
          }
        ]).then(function (input) {
          var roleId = selectRole().indexOf(input.role) + 1;
          connection.query("UPDATE employee SET WHERE ?",
            {
              last_name: input.lastName
            },
            {
              role_id: roleId
            },
            function (err) {
              if (err) {
                throw err;
              } else {
                console.log(input);
                initiatePrompt();
              }
            })
        })
      }
    })
};





