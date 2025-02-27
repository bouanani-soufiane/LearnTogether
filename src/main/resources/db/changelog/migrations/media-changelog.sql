-- Set the search path to the 'media' schema
SET search_path TO media;

-- Create the 'media' table
CREATE TABLE media.medias
(
    id             SERIAL PRIMARY KEY,
    type           TEXT    NOT NULL,
    url            TEXT    NOT NULL,
    public_id       TEXT    NOT NULL,
    reference_type TEXT    NOT NULL,
    reference_id   INTEGER NOT NULL,
    uploaded_at    DATE DEFAULT CURRENT_DATE,
    size           DOUBLE PRECISION
);
