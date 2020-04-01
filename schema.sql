drop database if exists employeeDB;

create database employeeDB;

use employeeDB;

drop table if exists departments;

create table departments(
    id int auto_increment not null,
    primary key (id),
    name varchar(30) not null,
    unique key (name)
);

drop table if exists roles;
create table roles (
    id int auto_increment not null,
    primary key (id),
    title varchar(30) not null,
    unique key (title),
    salary DECIMAL,
    department_id int,
    foreign key (department_id) references departments (id)
);

drop table if exists employees;
create table employees (
    id int auto_increment not null, 
    primary key (id),
    first_name varchar(30) not null, 
    last_name varchar(30) not null, 
    role_id int, 
    foreign key (role_id) references roles (id),
    manager_id int,
    foreign key (manager_id) references employees (id)
);

insert into departments (name)
values 
    ("Sales"),
    ("Engineering"),
    ("Finance"),
    ("Legal"), 
    ("Marketing");

insert into roles (title)
values 
    ("Manager"),
    ("Engineer");

insert into employees (first_name, last_name)
values 
    ("John", "Doe"),
    ("Sally", "Mae"),
    ("Ben", "Silverberg"),
    ("Joseph", "Zhang"),
    ("Austin", "Nguyen"),
    ("Harvey", "Specter"), 
    ("Tessa", "Robertson"),
    ("Grace", "Jung");