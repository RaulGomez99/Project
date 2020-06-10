CREATE ROLE admin WITH LOGIN PASSWORD 'admin';
CREATE DATABASE easyswisstournament WITH OWNER admin;
\c easyswisstournament admin

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name varchar(100) NOT NULL,
  last_name varchar(100) NOT NULL,
  email varchar(255) NOT NULL,
  username varchar(255) NOT NULL,
  password varchar(255) NOT NULL,
  isPremiun BOOLEAN NOT NULL DEFAULT FALSE,
  logo varchar(100) NOT NULL DEFAULT 'default.png'
) ;

CREATE TABLE tournaments (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  creator INTEGER REFERENCES users(id),
  participants JSON NOT NULL DEFAULT '[]',
  matches JSON NOT NULL DEFAULT '[]',
  state INTEGER NOT NULL DEFAULT 0
) ;

INSERT INTO users (name, last_name, email, username, password, logo) VALUES
('Raul', 'Gomez Lopez', 'gomezlopezraul1999xd@gmail.com', 'RaulGL99', '$2b$13$De7d2oaqunRJK6rS2rLfSuGHU0y2cwB/yFBE10xYLbntbSUqazUgO', 'admin.png');

INSERT INTO tournaments (name, creator) VALUES ('Tournament', 1);
INSERT INTO tournaments (name, creator) VALUES ('Tournament2', 1);
