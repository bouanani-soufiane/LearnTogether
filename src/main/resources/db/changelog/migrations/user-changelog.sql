SET search_path TO youcoder;

CREATE TYPE youcoder.user_status AS ENUM ('ACTIVE', 'INACTIVE', 'BANNED');

CREATE TYPE youcoder.user_role AS ENUM ('STUDENT', 'TEACHER', 'ADMIN');

CREATE CAST (varchar AS youcoder.user_role) WITH INOUT AS IMPLICIT;
CREATE CAST (varchar AS youcoder.user_status) WITH INOUT AS IMPLICIT;


CREATE TABLE youcoder.users
(
    id        SERIAL PRIMARY KEY,
    full_name TEXT                 NOT NULL,
    email     TEXT                 NOT NULL UNIQUE,
    password  TEXT                 NOT NULL,
    status    youcoder.user_status NOT NULL,
    role      youcoder.user_role   NOT NULL
);

CREATE TABLE youcoder.profiles
(
    user_id      INTEGER NOT NULL PRIMARY KEY,
    bio          TEXT,
    location     TEXT,
    website_link TEXT,
    birthdate    DATE,
    joined_at    timestamp,
    FOREIGN KEY (user_id) REFERENCES youcoder.users (id) ON DELETE CASCADE
);


-- Insert into users table
INSERT INTO youcoder.users (full_name, email, password, status, role)
VALUES ('John Doe', 'john.doe@example.com', 'password1', 'ACTIVE', 'STUDENT'),
       ('Jane Smith', 'jane.smith@example.com', 'password2', 'ACTIVE', 'TEACHER'),
       ('Alice Johnson', 'alice.johnson@example.com', 'password3', 'INACTIVE', 'ADMIN'),
       ('Bob Brown', 'bob.brown@example.com', 'password4', 'ACTIVE', 'STUDENT'),
       ('Charlie Davis', 'charlie.davis@example.com', 'password5', 'BANNED', 'TEACHER'),
       ('Eve Wilson', 'eve.wilson@example.com', 'password6', 'ACTIVE', 'ADMIN'),
       ('Frank Miller', 'frank.miller@example.com', 'password7', 'INACTIVE', 'STUDENT'),
       ('Grace Lee', 'grace.lee@example.com', 'password8', 'ACTIVE', 'TEACHER'),
       ('Heidi Clark', 'heidi.clark@example.com', 'password9', 'BANNED', 'ADMIN'),
       ('Ivan Harris', 'ivan.harris@example.com', 'password10', 'ACTIVE', 'STUDENT');

-- Insert into profiles table
INSERT INTO youcoder.profiles (user_id, bio, location, website_link, birthdate, joined_at)
VALUES (1, 'Software Developer', 'New York', 'http://john.example.com', '1990-01-01', NOW()),
       (2, 'Data Scientist', 'San Francisco', 'http://jane.example.com', '1985-05-15', NOW()),
       (3, 'System Administrator', 'London', 'http://alice.example.com', '1980-08-22', NOW()),
       (4, 'Web Developer', 'Berlin', 'http://bob.example.com', '1992-12-10', NOW()),
       (5, 'Database Administrator', 'Paris', 'http://charlie.example.com', '1988-03-30', NOW()),
       (6, 'Network Engineer', 'Tokyo', 'http://eve.example.com', '1991-07-07', NOW()),
       (7, 'Cybersecurity Analyst', 'Sydney', 'http://frank.example.com', '1987-11-29', NOW()),
       (8, 'UX Designer', 'Toronto', 'http://grace.example.com', '1993-04-14', NOW()),
       (9, 'Product Manager', 'Seattle', 'http://heidi.example.com', '1989-09-19', NOW()),
       (10, 'QA Engineer', 'Chicago', 'http://ivan.example.com', '1994-06-06', NOW());
