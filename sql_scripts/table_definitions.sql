CREATE TABLE website_user (
	username VARCHAR(64) CHECK(LENGTH(username) >= 6),
	email VARCHAR(256) NOT NULL,
    password CHAR(32) NOT NULL,
    isdeleted boolean DEFAULT false NOT NULL,
    PRIMARY KEY (username)
);

CREATE TABLE follows (
	is_followed VARCHAR(64),
    follower VARCHAR(64),
    PRIMARY KEY (is_followed, follower),
    FOREIGN KEY (is_followed) REFERENCES website_user(username)
		ON DELETE CASCADE
        ON UPDATE CASCADE,
	FOREIGN KEY (follower) REFERENCES website_user(username)
		ON DELETE CASCADE
        ON UPDATE CASCADE,
	CHECK(is_followed <> follower)
);

CREATE TABLE game(
	name VARCHAR(128),
    releaseyear INTEGER CHECK(releaseyear > 1960 and releaseyear < 2100),
    description TEXT,
	genre VARCHAR(64),
    PRIMARY KEY (name, releaseyear)
);

CREATE TABLE mod_for_game(
	game_name VARCHAR(128) NOT NULL,
    game_release_year INTEGER NOT NULL,
    modId SERIAL,
    name VARCHAR(128) NOT NULL,
    link VARCHAR(256) CHECK((link LIKE 'http://%') OR (link LIKE 'https://%')),
    description TEXT,
    PRIMARY KEY (modId),
    FOREIGN KEY (game_name,game_release_year) REFERENCES game(name,releaseyear)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION
);

ALTER SEQUENCE mod_for_game_modId_seq RESTART WITH 1000000;

CREATE TABLE post(
	username VARCHAR(64) NOT NULL,
    game_name VARCHAR(128) NOT NULL,
    game_release_year INTEGER NOT NULL,
    title VARCHAR(128),
    date DATE DEFAULT current_date CHECK(date <= current_date),
    time TIME DEFAULT current_time,
    body TEXT,
    PRIMARY KEY (title, date, time),
    FOREIGN KEY (game_name,game_release_year) REFERENCES game(name,releaseyear)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION,
	FOREIGN KEY (username) REFERENCES website_user(username)
		ON DELETE NO ACTION
        ON UPDATE CASCADE
);

CREATE TABLE comment_for_post(
	post_title VARCHAR(128),
    post_date DATE,
    post_time TIME,
    comment_date DATE DEFAULT current_date CHECK(comment_date <= current_date),
    comment_time TIME DEFAULT current_time,
    comment_body TEXT,
    username VARCHAR(64) NOT NULL,
    PRIMARY KEY(post_title,post_date,post_time,comment_date,comment_time),
    FOREIGN KEY (post_title,post_date,post_time) REFERENCES post(title,date,time)
		ON DELETE CASCADE
        ON UPDATE CASCADE,
	FOREIGN KEY (username) REFERENCES website_user(username)
		ON DELETE NO ACTION
        ON UPDATE CASCADE
);

CREATE TABLE visits(
	username VARCHAR(64),
    title VARCHAR(128),
    date DATE,
    time TIME,
    most_recent_visit_date DATE DEFAULT current_date
		CHECK(most_recent_visit_date <= current_date),
    PRIMARY KEY(username,title,date,time),
    FOREIGN KEY (username) REFERENCES website_user(username)
		ON DELETE NO ACTION
        ON UPDATE CASCADE,
    FOREIGN KEY (title,date,time) REFERENCES post(title,date,time)
		ON DELETE NO ACTION
        ON UPDATE CASCADE
);

CREATE TABLE post_features_mod(
	modId INTEGER,
    title VARCHAR(128),
    date DATE,
    time TIME,
    config_importance_rating INTEGER
		CHECK(config_importance_rating >= 1 AND config_importance_rating <= 10),
    PRIMARY KEY (modId, title, date, time),
    FOREIGN KEY (title,date,time) REFERENCES post(title,date,time)
		ON DELETE CASCADE
        ON UPDATE CASCADE,
	FOREIGN KEY (modId) REFERENCES mod_for_game(modId)
		ON DELETE NO ACTION
        ON UPDATE CASCADE
);

CREATE TABLE favorites(
	username VARCHAR(64),
    title VARCHAR(128),
    date DATE,
    time TIME,
    favorite_date DATE DEFAULT current_date CHECK(favorite_date <= current_date),
    favorite_time TIME DEFAULT current_time,
    PRIMARY KEY(username,title,date,time),
    FOREIGN KEY (username) REFERENCES website_user(username)
		ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (title,date,time) REFERENCES post(title,date,time)
		ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE add_on_mod(
	modId INTEGER,
    hours_added INTEGER NOT NULL CHECK(hours_added > 0),
    num_new_items INTEGER NOT NULL CHECK(num_new_items >= 0),
    PRIMARY KEY (modId),
    FOREIGN KEY (modId) REFERENCES mod_for_game(modId)
		ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE graphical_mod(
	modId INTEGER,
    resolution VARCHAR(9) NOT NULL CHECK(resolution LIKE '%x%'),
    fps INTEGER NOT NULL CHECK(fps > 0),
    PRIMARY KEY (modId),
    FOREIGN KEY (modId) REFERENCES mod_for_game(modId)
		ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE unofficial_patch_mod(
	modId INTEGER,
    version VARCHAR(11) NOT NULL CHECK(version LIKE '%.%'),
    PRIMARY KEY (modId),
    FOREIGN KEY (modId) REFERENCES mod_for_game(modId)
		ON DELETE CASCADE
        ON UPDATE CASCADE
);
