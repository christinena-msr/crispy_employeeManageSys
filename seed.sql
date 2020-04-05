insert into departments (name)
values 
    ("Sales"),
    ("Engineering"),
    ("Finance"),
    ("Legal"), 
    ("Marketing");

insert into roles (title, isManager, salary, department_id)
values 
    ("Technical Product Manager", true, 150000, 2),
    ("Engineer", false, 100000, 2),
    ("Creative Director", true, 80000, 5),
    ("Content Specialist", false, 50000, 5),
    ("Financial Manager", true, 90000, 3),
    ("Financial Analyst", false, 70000, 3);

insert into employees (first_name, last_name, role_id, manager_id)
values 
    ("Ben", "Silverberg", 1, null),
    ("Joseph", "Zhang", 2, 1),
    ("Austin", "Nguyen", 2, 1),
    ("Harvey", "Specter", 6, 5), 
    ("Tessa", "Robertson", 5, null),
    ("Grace", "Jung", 3, null),
    ("Derek", "Ishii", 4, 6);
    
select * from roles;

select * from departments;

select * from employees;

select distinct roles_id, title, isManager, id, first_name, last_name from roles
left outer join employees
on roles_id = role_id;