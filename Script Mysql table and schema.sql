CREATE DATABASE IF NOT EXISTS mysql_db;

USE mysql_db;

CREATE TABLE IF NOT EXISTS mysql_table (
  first_name VARCHAR(20) NOT NULL,
  surname VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone_number VARCHAR(15) NOT NULL,
  eircode VARCHAR(6) NOT NULL
);


ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';