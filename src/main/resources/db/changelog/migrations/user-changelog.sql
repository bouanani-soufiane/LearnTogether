SET search_path TO youcoder;

CREATE TABLE youcoder.users
(
    id        SERIAL PRIMARY KEY,
    full_name TEXT                 NOT NULL,
    email     TEXT                 NOT NULL UNIQUE,
    password  TEXT                 NOT NULL,
    status    TEXT NOT NULL DEFAULT 'ACTIVE',
    role      TEXT   NOT NULL DEFAULT 'TEACHER'
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
