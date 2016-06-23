var fs 					  = require('fs');
var db 					  = require('../init_db');
var Sequelize 		= db.Sequelize;
var sequelize 		= db.sequelize;
var models = {};

//Create Item Table Structure
var JiraAccounts = sequelize.define('jira_accounts', {
	  id:           {type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true},
    protocal:     {type: Sequelize.STRING, allowNull:false},
    user_name:    {type: Sequelize.STRING, allowNull: false},
    url:          {type: Sequelize.STRING, allowNull: false},
    password:     {type: Sequelize.STRING, allowNull:false},
    account_email: {type: Sequelize.STRING, allowNull:false}
},
{
   timestamps : true,
   freezeTableName: true
});

var TimeSheet = sequelize.define('time_sheet', {
    task_id: {type: Sequelize.STRING, allowNull:false},
    start_time:{ type: Sequelize.STRING, allowNull: false},
    end_time: { type: Sequelize.STRING, allowNull: false}
},
{
   timestamps : true,
   freezeTableName: true
});

var Tasks = sequelize.define('tasks', {
    task_id: {type: Sequelize.INTEGER, autoIncrement:true, primaryKey:true},
    task_label: {type: Sequelize.STRING, allowNuyll:false},
    account_id:{ type: Sequelize.INTEGER, allowNull: false},
    priority: { type: Sequelize.STRING, allowNull: true},
    date_created: { type: Sequelize.DATE, allowNull: false},
    due_date: { type: Sequelize.DATE, allowNull: true},
    description: { type: Sequelize.STRING, allowNull: true}

},
{
   timestamps : true,
   freezeTableName: true
});

var Notes = sequelize.define('notes',{
    note_id: {type: Sequelize.INTEGER, autoIncrement:true, primaryKey:true},
    task_id:{ type: Sequelize.INTEGER, allowNull: false},
    description: { type: Sequelize.STRING, allowNull: false}
})

var Users = sequelize.define('users', {
	id: {type : Sequelize.INTEGER, autoIncrement: true, primaryKey: true},
  firstName: {type: Sequelize.STRING, allowNull:false},
  givenName: { type: Sequelize.STRING, allowNull: false},
  preferedName: { type: Sequelize.STRING, allowNull: false},
  password: {type: Sequelize.STRING, allowNull: false},
  emailAddress: {type: Sequelize.STRING, allowNull: false}
},
{
   timestamps : false,
   freezeTableName: true
});

models.JiraAccounts = JiraAccounts;
models.TimeSheet = TimeSheet;
models.Tasks = Tasks;
models.Notes = Notes;
models.Users = Users;

module.exports = models;