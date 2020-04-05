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
                break;
            // case "View All Employees by Manager":
            //     queryViewByManager();
            //     break;
            // case "View All Employees by Department":
            //     queryViewByDepartment();
                // break;
            case "Add Employee":
                queryAddEmployee();
                break;
            // case "Update Employee Role":
            //     queryUpdate(employees);
                // break;
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
        },{
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
                console.log("This is res from department insert query", res);
                let query = `insert into ${roles} (name, salary) values ("${answer.name}", "${answer.salary}")`;
                connection.query(query, (err, res) => {
                    if(err) throw err;
                    queryViewAll(res);
                    runApp();
                });  
            })
        });
};

const queryAddEmployee = () => {
    let roleQuery = `Select distinct roles_id, title from roles`;
    roleQuery += ` inner join employees`;
    roleQuery += ` on roles_id = role_id`;
    connection.query(roleQuery, (err, res_roles) => {
        if(err) throw err;
        let role = [];
        for (let i=0; i<res_roles.length; i++) {
            role.push(res_roles[i].title);
        };
        inquirer
        .prompt([
            {
                name: "firstName",
                type: "input",
                message: "What is the employee's first name?"
            },{
                name: "lastName",
                type: "input", 
                message: "What is the employee's last name?"
            },{
                name: "role",
                type: "list", 
                message: "What is the employee's role?",
                choices: role
            }
        ]).then(employee => {
            const roleId = res_roles.findIndex(row => row.title === employee.role);
            let managerQuery = `Select id, first_name, last_name from employees`;
            managerQuery += ` inner join roles`;
            managerQuery += ` on role_id = roles_id`;
            managerQuery += ` where isManager = true`;
            connection.query(managerQuery, (err, res_manager) => {
                if(err) throw err;
                let manager_list = [];
                console.log(res_manager);
                for (let i=0; i<res_manager.length; i++) {
                    manager_list.push(`${res_manager[i].first_name} ${res_manager[i].last_name}`);
                };
                manager_list.push("none");
                inquirer
                    .prompt({
                            name: "manager",
                            type: "list",
                            message: "Who is the employee's manager?",
                            choices: manager_list
                    })
                    .then(manager => {
                        let newEmployee = [employee.firstName, employee.lastName, res_roles[roleId].roles_id];
                        let insertQuery = "";
                        if (manager.manager === "none") {
                            insertQuery += `insert into employees (first_name, last_name, role_id)`;
                            insertQuery += `values (?, ?, ?) `;
                        } else {
                            insertQuery = `insert into employees (first_name, last_name, role_id, manager_id)`;
                            insertQuery += `values (?, ?, ?, ?) `;
                            const name = manager.manager.split(" ");
                            const managerId = res_manager.findIndex(row => row.first_name === name[0]);
                            console.log(managerId);
                            newEmployee.push(res_manager[managerId].id);
                        }
                        connection.query(insertQuery, newEmployee, (err, res) => {
                            if(err) throw err;
                            console.log(`Success! New employee ${employee.firstName} ${employee.lastName} added.`);
                            runApp();
                        });
                    });
            });
        }); 
    });
};