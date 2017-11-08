CREATE TABLE note (
	id int not null AUTO_INCREMENT PRIMARY KEY,
	note varchar(3000) not null,
	is_active int not null,
	reminder_time datetime,
	expired_to int,
	user_id int not null,
	createdAt datetime not null,
	updatedAt datetime not null
);

CREATE TABLE note_meta (
	id int not null AUTO_INCREMENT PRIMARY KEY,
	note_id int not null,
	meta_relation varchar(255),
	type_id int not null
);

CREATE TABLE note_type (
	id int not null AUTO_INCREMENT PRIMARY KEY,
	type varchar(255) not null,
	type_description varchar(3000) not null
);

INSERT INTO note_type (id, type, type_description)
VALUES (1, "general", "Notes not associated with any specific task, project, release, or sprint.");

INSERT INTO note_type (id, type, type_description)
VALUES (2, "task", "Notes associated to a specific task.");

INSERT INTO note_type (id, type, type_description)
VALUES (3, "project", "Notes about a project.");

INSERT INTO note_type (id, type, type_description)
VALUES (4, "sprint", "Notes relating to a sprint.");

INSERT INTO note_type (id, type, type_description)
VALUES (5, "release", "Notes relating to a release.");
