var fs 					  = require('fs');
var db 					  = require('../init_db');
var Sequelize 		= db.Sequelize;
var sequelize 		= db.sequelize;
var models = {};

//Create Item Table Structure
var jiraAccounts = sequelize.define('jira_accounts', {
	  id:            { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true},
    protocal:      { type: Sequelize.STRING, allowNull:false},
    user_name:     { type: Sequelize.STRING, allowNull: false},
    url:           { type: Sequelize.STRING, allowNull: false},
    password:      { type: Sequelize.STRING, allowNull:false},
    account_email: { type: Sequelize.STRING, allowNull:false},
    user_id:       { type: Sequelize.INTEGER, allowNull:false}
},
{
   timestamps : true,
   freezeTableName: true
});

var timeSheet = sequelize.define('time_sheet', {
    task_id:      { type: Sequelize.STRING, allowNull:false},
    start_time:   { type: Sequelize.INTEGER, allowNull: false},
    end_time:     { type: Sequelize.INTEGER, allowNull: false},
    account_id:   { type: Sequelize.INTEGER, allowNull:false},
    user_id:      { type: Sequelize.INTEGER, allowNull:false}
},
{
   timestamps : false,
   freezeTableName: true
});

var tasks = sequelize.define('tasks', {
    task_id:      { type: Sequelize.INTEGER, autoIncrement:true, primaryKey:true},
    task_label:   { type: Sequelize.STRING, allowNuyll:false},
    account_id:   { type: Sequelize.INTEGER, allowNull: false},
    priority:     { type: Sequelize.STRING, allowNull: true},
    date_created: { type: Sequelize.DATE, allowNull: false},
    due_date:     { type: Sequelize.DATE, allowNull: true},
    description:  { type: Sequelize.STRING, allowNull: true},
    user_id:      { type: Sequelize.INTEGER, allowNull:false}
},
{
   timestamps : true,
   freezeTableName: true
});

var notes = sequelize.define('notes',{
    note_id:      { type: Sequelize.INTEGER, autoIncrement:true, primaryKey:true},
    task_id:      { type: Sequelize.STRING, allowNull: true},
    description:  { type: Sequelize.STRING, allowNull: false},
    is_active:    { type: Sequelize.INTEGER, allowNull: false},
    user_id:      { type: Sequelize.INTEGER, allowNull:false}
},
{
   timestamps : true,
   freezeTableName: true
})

var users = sequelize.define('users', {
	id:               { type : Sequelize.INTEGER, autoIncrement: true, primaryKey: true},
  first_name:       { type: Sequelize.STRING, allowNull:false},
  last_name:       { type: Sequelize.STRING, allowNull: false},
  user_name:        { type: Sequelize.STRING, allowNull: false},
  password:         { type: Sequelize.STRING, allowNull: false},
  is_admin:         { type: Sequelize.INTEGER, allowNull: false},
  is_active:        { type: Sequelize.INTEGER, allowNull: false},
  email_address:    { type: Sequelize.STRING, allowNull: false}
},
{
   timestamps : false,
   freezeTableName: true
});

models.users = users;
models.notes = notes;
models.tasks = tasks;
models.timeSheet = timeSheet;
models.jiraAccounts = jiraAccounts;

module.exports = models;