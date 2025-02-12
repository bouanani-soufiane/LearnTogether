-- V2__user_create_tables.sql

-- Set the search path to the 'user' schema
SET search_path TO youcoder;

-- Create the 'users' table
CREATE TABLE youcoder.users
(
    id        SERIAL PRIMARY KEY,
    full_name TEXT NOT NULL,
    email     TEXT NOT NULL UNIQUE,
    password  TEXT NOT NULL
);

-- Create the 'profiles' table
CREATE TABLE youcoder.profiles
(
    id           SERIAL PRIMARY KEY,
    user_id      INTEGER NOT NULL,
    bio          TEXT,
    location     TEXT,
    website_link TEXT,
    birthdate    DATE,
    joined_at    DATE DEFAULT CURRENT_DATE,
    FOREIGN KEY (user_id) REFERENCES youcoder.users (id) ON DELETE CASCADE
);

-- Create the 'roles' table (this is a value object, not an entity)
CREATE TABLE youcoder.roles
(
    id   SERIAL PRIMARY KEY,
    name TEXT NOT NULL
);

-- Create the 'user_roles' table to establish the relationship between 'users' and 'roles'
CREATE TABLE youcoder.user_roles
(
    user_id INTEGER NOT NULL,
    role_id INTEGER NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES youcoder.users (id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES youcoder.roles (id) ON DELETE CASCADE
);
