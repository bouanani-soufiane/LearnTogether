-- Set the search path to the 'club' schema
SET search_path TO club;

-- Create the 'clubs' table
CREATE TABLE club.clubs
(
    id           SERIAL PRIMARY KEY,
    name         TEXT NOT NULL UNIQUE,
    description  TEXT,
    max_members  INTEGER CHECK (max_members > 0),
    is_private   BOOLEAN DEFAULT FALSE,
    owner_id     INTEGER NOT NULL
);

-- Create the 'club_members' table to track which users join which clubs
CREATE TABLE club.club_members
(
    club_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (club_id, user_id),
    FOREIGN KEY (club_id) REFERENCES club.clubs (id) ON DELETE CASCADE
);
