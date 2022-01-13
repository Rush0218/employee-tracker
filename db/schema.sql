DROP DATABASE IF EXISTS company; 
CREATE DATABASE company; 
USE company; 
 


CREATE TABLE department (
  id INTEGER AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30) NOT NULL
);

CREATE TABLE role (
  id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30),
  salary DECIMAL,
  department_id INTEGER,
  FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee (
  id INTEGER  NOT NULL AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) ,
  last_name VARCHAR(30),
  role_id INTEGER,
  manager_id INTEGER,
  FOREIGN KEY (role_id) REFERENCES role(id), 
  FOREIGN KEY (manager_id) REFERENCES employee(id)
);



INSERT INTO department (name) VALUE ("Sales");
INSERT INTO department (name) VALUE ("Tech");
INSERT INTO department (name) VALUE ("Finance");
INSERT INTO department (name) VALUE ("Legal");


INSERT INTO role (title, salary, department_id) VALUE ("Senior Software Engineer", 175000, 2);
INSERT INTO role (title, salary, department_id) VALUE ("Legal Team Lead", 200000, 4);
INSERT INTO role (title, salary, department_id) VALUE ("Accountant", 95000, 3);
INSERT INTO role (title, salary, department_id) VALUE ("Sales Lead", 100000, 1);
INSERT INTO role (title, salary, department_id) VALUE ("Sales Rep", 80000, 1);
INSERT INTO role (title, salary, department_id) VALUE ("Software Engineer", 125000, 2);
INSERT INTO role (title, salary, department_id) VALUE ("Lawyer", 190000, 4);


INSERT INTO employee (first_name, last_name, manager_id, role_id) VALUE ("Tre", "Rush", null, 1);
INSERT INTO employee (first_name, last_name, manager_id, role_id) VALUE ("Natasha", "Romanoff", null, 2);
INSERT INTO employee (first_name, last_name, manager_id, role_id) VALUE ("Stephen","Strange",null ,3);
INSERT INTO employee (first_name, last_name, manager_id, role_id) VALUE ("Tony", "Stark", 1, 4);
INSERT INTO employee (first_name, last_name, manager_id, role_id) VALUE ("John", "Wick", 4, 5);
INSERT INTO employee (first_name, last_name, manager_id, role_id) VALUE ("Peter", "Parker", 1, 6);
INSERT INTO employee (first_name, last_name, manager_id, role_id) VALUE ("Jinwoo", "Sung", 2, 7);