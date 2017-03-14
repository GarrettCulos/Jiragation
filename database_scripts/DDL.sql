CREATE TABLE `users` (
	`id`
	`first_name`
	`last_name`
	`password`
	`email_address`
	`user_name`
	`user_status`
	`createdAt`
	`updatedAt`
);

CREATE TABLE `notes` (
	`id`
	`user_id`
	`task_id`
	`description`
	`createdAt`
	`updatedAt`
);

CREATE TABLE `accounts` (
	`id`
	`protocal`
	`account_user_name`
	`account_password`
	`account_email`
	`createdAt`
	`updatedAt`
);

CREATE TABLE `time_sheet` (
	`id`
	`task_id`
	`start_time`
	`end_time`
);

CREATE TABLE `tasks` (
	`id`
	`external_task_id`
	`task_label`
	`account_id`
	`priority`
	`user_status`
	`date_created`
	`due_date`
	`description`
	`user_id`
	`createdAt`
	`updatedAt`
);

CREATE TABLE `user_account_map` (
	`id`
	`user_id`
	`account_id`
);

CREATE TABLE `projects` (
	`id`
	`name`
	`description`
	`user_id`
	`account_id`
	`createdAt`
	`updatedAt`
);

CREATE TABLE `user_metadata` (
	`id`
	`user_id`
	`metadata`
	`createdAt`
	`updatedAt`
);
