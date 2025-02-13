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
    status    youcoder.user_status NOT NULL DEFAULT 'ACTIVE',
    role      youcoder.user_role   NOT NULL DEFAULT 'TEACHER'
);

CREATE TABLE youcoder.profiles
(
    user_id      INTEGER PRIMARY KEY,
    bio          TEXT,
    location     TEXT,
    website_link TEXT,
    birthdate    DATE,
    joined_at    DATE DEFAULT CURRENT_DATE,
    FOREIGN KEY (user_id) REFERENCES youcoder.users (id) ON DELETE CASCADE
);
