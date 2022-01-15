//import modules
const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require('console.table');


require('dotenv').config();

var roleArr = [];
var managerArr = [];
var deptArr = [];

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
        "View All Roles",
        "View All Departments",
        "View All Employees By Role",
        "View All Employees By Deparment",
        "Add Department",
        "Add Role",
        "Add Employee",
        "Update Employee"
      ]
    }
  ]).then(function (input) {
    switch (input.choice) {
      case "View All Employees":
        viewAllEmployees();
        break;

      case "View All Roles":
        viewAllRoles();
        break;

      case "View All Departments":
        viewDepts();
        break;

      case "View All Employees By Role":
        viewAllRoles();
        break;

      case "View All Employees By Deparment":
        viewAllDepts();
        break;

      case "Add Department":
        addDept();
        break;

      case "Add Role":
        addRole();
        break;

      case "Add Employee":
        addEmployee();
        break;

      case "Update Employee":
        updateEmployee();
        break;
    }
  })
};


//created a function to view all employees
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

//create a function to view all roles
function viewAllRoles() {
  connection.query('SELECT * FROM role;',
    function (err, res) {
      if (err) {
        throw err
      }
      console.table(res)
      initiatePrompt();
    })
};

//create a function to view all departments 
function viewDepts() {
  connection.query('SELECT * FROM department;',
    function (err, res) {
      if (err) {
        throw err;
      }
      console.table(res);
      initiatePrompt();
    })
};

//create function to view all employees by department
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


// create function to get all data within the role table
function selectRole() {
  console.log(roleArr)
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

// create function to grab all employee's that have the title of manager
function selectManager() {
  connection.query('SELECT first_name, last_name FROM employee WHERE manager_id IS NULL', function (err, res) {
    if (err) {
      throw err;
    } else {
      for (var i = 0; i < res.length; i++) {
        managerArr.push(res[i].first_name + " " + res[i].last_name);
      }
    }
  })
  console.log(managerArr)
  return managerArr;
};

// create function to get all data from department table
function selectDept() {
  connection.query('SELECT * FROM department', function (err, res) {
    if (err) {
      throw err;
    } else {
      for (var i = 0; i < res.length; i++) {
        deptArr.push(res[i].id);
      }
    }
  })
  return deptArr;
};


//create function to add new employees 
function addEmployee() {
  inquirer.prompt([
    {
      name: "firstname",
      type: "input",
      message: "Please enter the employee's first name."
    },
    {
      name: "lastname",
      type: "input",
      message: "Please enter the employee's last name."
    },
    {
      name: "role",
      type: "list",
      message: "Please select the employee's role.",
      choices: selectRole()
    },
    {
      name: "choice",
      type: "list",
      message: "Please select the employee's manager.",
      choices: selectManager()
    }
  ]).then(function (data) {
    var roleId = selectRole().indexOf(data.role) + 1
    var managerId = selectManager().indexOf(data.choice) + 1
    connection.query("INSERT INTO employee SET ?",
      {
        first_name: data.firstname,
        last_name: data.lastname,
        manager_id: managerId,
        role_id: roleId
      },
      function (err) {
        if (err) {
          throw err;
        } else {
          console.table(data);
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
            type: 'list',
            choices: function () {
              var lastName = [];
              for (var i = 0; i < res.length; i++) {
                lastName.push(res[i].last_name);
              }
              return lastName;
            },
            message: "Please select the employee's last name."
          },
          {
            name: 'role',
            type: 'list',
            message: 'Please select their new title.',
            choices: selectRole()
          },
        ]).then(function (data) {
          console.log(data)
          var roleId = selectRole().indexOf(data.role) + 1
          console.log(roleId)
          connection.query(`UPDATE employee SET role_id = ${roleId} WHERE last_name = "${data.lastName}"`,
            function (err) {
              if (err) {
                throw err;
              } else {
                console.table(data);
                initiatePrompt();
              }
            })
        })
      }
    })
};

//create function to allow users to add new roles 

function addRole() {
  inquirer.prompt([
    {
      name: 'title',
      type: 'input',
      message: "Please input the new role's title."
    },
    {
      name: 'salary',
      type: 'input',
      message: "Please input the new role's salary."
    },
    {
      name: 'department_id',
      type: 'list',
      message: 'Please select the deptartment.',
      choices: selectDept()
    }
  ]).then(function (res) {
    connection.query('INSERT INTO role SET ?',
      {
        title: res.title,
        salary: res.salary,
        department_id: res.department_id
      }, function (err) {
        if (err) {
          throw err;
        } else {
          console.table(res);
          initiatePrompt();
        }
      }
    )
  })
};


//create function to allow users to add new departments
function addDept() {
  inquirer.prompt([
    {
      name: "name",
      type: "input",
      message: "Please provide the department's name."
    }
  ]).then(function (res) {
    connection.query(`INSERT INTO department SET name = "${res.name}"`,
      function (err) {
        if (err) {
          throw err;
        } else {
          console.table(res);
          initiatePrompt();
        }
      })
  })
};




