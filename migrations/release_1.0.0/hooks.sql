CREATE TABLE hooks (
 	id INTEGER PRIMARY KEY,
    account_id INTEGER not null,
    hash VARCHAR(255) not null,
    hook_type VARCHAR(255) not null,
    hook_info VARCHAR(3000) not null,
	createdAt datetime not null,
	updatedAt datetime not null
);