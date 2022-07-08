CREATE DATABASE company;

CREATE TABLE company(
  company_id SERIAL PRIMARY KEY,
  "name" VARCHAR(255),
  cin VARCHAR(255)
);