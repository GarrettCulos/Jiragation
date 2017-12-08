CREATE TABLE notifications (
	id int not null AUTO_INCREMENT PRIMARY KEY,
	data varchar(10000) not null,
	status int not null,
	task_id varchar(255) not null,
	account_id not null,
	user_id int not null,
	createdAt datetime not null,
	updatedAt datetime not null
);
