-- Set the search path to the 'reputation' schema
SET search_path TO reputation;

-- Create the 'badges' table
CREATE TABLE reputation.badges
(
    id                   SERIAL PRIMARY KEY,
    name                 TEXT    NOT NULL UNIQUE,
    type                 TEXT    NOT NULL,
    required_points      INTEGER NOT NULL CHECK (required_points >= 0),
    achievement_criteria TEXT
);

-- Create the 'reputation_scores' table
CREATE TABLE reputation.reputation_scores
(
    id      SERIAL PRIMARY KEY,
    points  INTEGER NOT NULL DEFAULT 0 CHECK (points >= 0),
    user_id INTEGER NOT NULL UNIQUE,
    level   TEXT    NOT NULL CHECK (level IN ('Beginner', 'Intermediate', 'Advanced', 'Expert'))
);

-- Create the association table for many-to-many relationship
CREATE TABLE reputation.reputation_score_badges
(
    reputation_score_id INTEGER NOT NULL REFERENCES reputation.reputation_scores (id) ON DELETE CASCADE,
    badge_id            INTEGER NOT NULL REFERENCES reputation.badges (id) ON DELETE CASCADE,
    PRIMARY KEY (reputation_score_id, badge_id)
);