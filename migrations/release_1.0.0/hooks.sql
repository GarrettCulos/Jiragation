CREATE TABLE hooks (
 	id not null INTEGER PRIMARY KEY,
    account_id not null INTEGER,
    hash not null VARCHAR(255),
    hook_type not null VARCHAR(255),
    hook_info not null VARCHAR(3000),
	createdAt datetime not null,
	updatedAt datetime not null
);