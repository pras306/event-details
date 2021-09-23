--------------------------------------------COMMANDS WRITTEN IN POSTGRES SQL--------------------------------------------------------
CREATE TABLE events(
    id BIGSERIAL PRIMARY KEY NOT NULL,
    event_title VARCHAR(200) NOT NULL,
    event_description TEXT,
    event_date DATE NOT NULL,
    event_start_time TIME NOT NULL,
    event_length VARCHAR(100),
    event_status BOOLEAN DEFAULT TRUE
);

CREATE TABLE event_organizer(
    id BIGSERIAL PRIMARY KEY NOT NULL,
    first_name VARCHAR(200) NOT NULL,
    last_name VARCHAR(200) NOT NULL,
    event_id INT NOT NULL,
    CONSTRAINT fk_events
    FOREIGN KEY(event_id)
    REFERENCES events(id)
    ON DELETE CASCADE
);

CREATE TABLE event_participant(
    id BIGSERIAL PRIMARY KEY NOT NULL,
    first_name VARCHAR(200) NOT NULL,
    last_name VARCHAR(200) NOT NULL,
    event_id INT NOT NULL,
    CONSTRAINT fk_events
    FOREIGN KEY(event_id)
    REFERENCES events(id)
    ON DELETE CASCADE
);