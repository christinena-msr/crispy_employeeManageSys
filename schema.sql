drop database if exists employeeDB;

create database employeeDB;

use employeeDB;

drop table if exists departments;

create table departments(
    departments_id int auto_increment not null,
    primary key (departments_id),
    name varchar(30) not null,
    unique key (name)
);

drop table if exists roles;
create table roles (
    roles_id int auto_increment not null,
    primary key (roles_id),
    title varchar(30) not null,
    isManager boolean default false,
    unique key (title),
    salary DECIMAL,
    department_id int,
    foreign key (department_id) references departments (departments_id)
);

drop table if exists employees;
create table employees (
    id int auto_increment not null, 
    primary key (id),
    first_name varchar(30) not null, 
    last_name varchar(30) not null, 
    role_id int, 
    foreign key (role_id) references roles (roles_id),
    manager_id int references employees (id)
);