-- Set the search path to the 'content' schema
SET search_path TO content;

-- Create ENUM type for review status
CREATE TYPE review_status_enum AS ENUM ('APPROVED', 'REJECTED', 'PENDING');

-- Create the 'questions' table
CREATE TABLE content.questions
(
    id      SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    title   TEXT NOT NULL,
    content TEXT NOT NULL
);

-- Create the 'answers' table
CREATE TABLE content.answers
(
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER NOT NULL,
    question_id INTEGER NOT NULL,
    content     TEXT NOT NULL,
    is_valid    BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (question_id) REFERENCES content.questions (id) ON DELETE CASCADE
);

-- Create the 'votes' table
CREATE TABLE content.votes
(
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER NOT NULL,
    question_id INTEGER,
    answer_id   INTEGER,
    value       INTEGER NOT NULL CHECK (value IN (-1, 1)),
    CHECK ((question_id IS NOT NULL AND answer_id IS NULL) OR (question_id IS NULL AND answer_id IS NOT NULL)),
    FOREIGN KEY (question_id) REFERENCES content.questions (id) ON DELETE CASCADE,
    FOREIGN KEY (answer_id) REFERENCES content.answers (id) ON DELETE CASCADE
);

-- Create the 'tags' table
CREATE TABLE content.tags
(
    id   SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

-- Create the 'question_tags' table for many-to-many relationship between questions and tags
CREATE TABLE content.question_tags
(
    question_id INTEGER NOT NULL,
    tag_id      INTEGER NOT NULL,
    PRIMARY KEY (question_id, tag_id),
    FOREIGN KEY (question_id) REFERENCES content.questions (id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES content.tags (id) ON DELETE CASCADE
);













-- Create the 'blogs' table
CREATE TABLE content.blogs
(
    id            SERIAL PRIMARY KEY,
    user_id       INTEGER NOT NULL,
    title         TEXT NOT NULL,
    content       TEXT NOT NULL,
    views         INTEGER DEFAULT 0,
    review_status review_status_enum NOT NULL,
    reviewed_at   DATE
);

-- Create the 'blog_tags' table for many-to-many relationship between blogs and tags
CREATE TABLE content.blog_tags
(
    blog_id INTEGER NOT NULL,
    tag_id  INTEGER NOT NULL,
    PRIMARY KEY (blog_id, tag_id),
    FOREIGN KEY (blog_id) REFERENCES content.blogs (id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES content.tags (id) ON DELETE CASCADE
);

-- Create the 'comments' table
CREATE TABLE content.comments
(
    id             SERIAL PRIMARY KEY,
    user_id        INTEGER NOT NULL,
    content        TEXT NOT NULL,
    reference_type TEXT NOT NULL CHECK (reference_type IN ('QUESTION', 'ANSWER', 'BLOG')),
    reference_id   INTEGER NOT NULL
);

-- Create the 'likes' table
CREATE TABLE content.likes
(
    id       SERIAL PRIMARY KEY,
    user_id  INTEGER NOT NULL,
    blog_id  INTEGER NOT NULL,
    liked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (blog_id) REFERENCES content.blogs (id) ON DELETE CASCADE
);
