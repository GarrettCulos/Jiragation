var fs 					= require('fs');

var db 					= require('./init_db.js');

var Sequelize 			= db.Sequelize;

var sequelize 			= db.sequelize;

var accounts = [];


sequelize.query('SELECT * FROM jiraAccounts').then(function(projects){
	accounts.push(projects);
	console.log(projects); //for testing
})


//return an array [{account}, {account} , ... , {account}]