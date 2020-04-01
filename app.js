const mysql = require("mysql");
const inquirer = require("inquirer");
const consoleTable = require("console.table");

const employees = "employees";
const roles = "roles";
const departments = "departments";

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password1",
    database: "employeeDB"
});

connection.connect(err => {
    if(err) throw err;
    //name of function to run CLI app
    runApp();
});

function runApp() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View All Employees",
                // "View All Employees by Manager",
                // "View All Employees by Department",
                "Add Employee",
                // "Update Employee Role",
                // "Update Employee",
                // "Remove Employee",
                "View All Departments",
                "Add Department",
                // "Remove Department",
                // "Update Department",
                "View All Roles",
                // "Add Role",
                // "Remove Role",
                // "Update Role",
                // "View Department Budget",
                "exit"
            ]
        })
        .then(answer => {
            switch(answer.action) {
            case "View All Employees":
                queryViewAll(employees);
            //     break;
            // case "View All Employees by Manager":
            //     queryViewByManager();
            //     break;
            // case "View All Employees by Department":
            //     queryViewByDepartment();
            //     break;
            case "Add Employee":
                queryAddEmployee();
                break;
            // case "Update Employee Role":
            //     queryUpdate(employees);
                break;
            case "View All Departments":
                queryViewAll(departments);
                break;
            case "View All Roles":
                queryViewAll(roles);
                break;
            case "Add Department":
                queryAddDepartment();
                break;
            case "Add Role":
                queryAddRole();
                break;
            case "exit":
                connection.end();
                break;
            }
        });
}

const queryViewAll = (tableName) => {
    const query = "Select * from " + tableName;
    console.log(query);
    connection.query(query, (err, res) => {
        if(err) throw err;
        console.table(res);
        runApp();
    });
};

const queryAddDepartment = () => {
    inquirer
        .prompt({
            name: "name", 
            type: "input", 
            message: "Enter the name of a new department:"
        })
        .then(answer => {
            let query = `insert into ${departments} (name) values ("${answer.name}")`;
            connection.query(query, (err, res) => {
                if(err) throw err;
                queryViewAll(departments);
            });
        });
};

const queryAddRole = () => {
    inquirer
        .prompt([
        {
            name: "department", 
            type: "input",
            message: "Enter the department for this role:"
        },{
            name: "name", 
            type: "input", 
            message: "Enter the name of a new role:"
        }, {
            name: "salary",
            type: "input",
            message: "Enter the salary for this role:"
        }
        ])
        .then(answer => {
            // insert into departments if unique 
            let department = `insert into ${departments} (name) values ("${answer.department}")`;
            connection.query(department, (err, res) => {
                if(err) throw err;
                // add role to roles
                let query = `insert into ${roles} (name, salary) values ("${answer.name}", "${answer.salary}")`;
                connection.query(query, (err, res) => {
                    if(err) throw err;
                    queryViewAll(roles);
                });  
            })
        });
};

// const queryAddEmployee = () => {
//     inquirer
//         .prompt([
//         {
//             name: "firstName",
//             type: "input",
//             message: "What is the employee's first name?"
//         }, {
//             name: "lastName",
//             type: "input", 
//             message: "What is the employee's last name?"
//         }, {
//             name: "role",
//             type: "input", 
//             message: "What is the employee's role?"
//         }, {
//             name: "manager", 
//             type: "input", 
//             message: "Who is the manager?"
//         }
//         ])
//         .then(employee => {
//             const manager = `Select id from ${employees} where ?`;
//             connection.query(manager, {: employee.manager}, (err, res) => {
//                 if(err) throw err;
//                 console.log(res);
//             });
//             // const query = `Insert into ${employees} (first_name, last_name) `;
//             // query += `values ("${employee.firstName}", "${employee.lastName}")`;
//         }); 
// }