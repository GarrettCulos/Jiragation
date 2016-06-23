var db 					= require('../init_db');
var model 				= require('./jiragation');
var Sequelize 			= db.Sequelize;
var sequelize 			= db.sequelize;

var Tasks = function() {

};

Tasks.getTasks = function(callback) {
	

};

Tasks.getTaskById = function(callback) {
	// Requires task id

	
};

Tasks.getTasksByDate = function(callback) {
	// Requires date range
	// Search for date_created between range

	
	// var queryString = "SELECT user_name,url,password,protocal FROM jira_accounts";
	
	// sequelize.query(queryString, { type: Sequelize.QueryTypes.SELECT })
	// .then(function(results){
	// 	callback(results);
	// })
	// .catch(function(err){
	// 	console.log(err);
	// 	throw err;
	// });
};

Tasks.addTasks = function(callback) {
	// Req Nothing.


};

Tasks.updateTasks = function(callback) {
	// Requires task ID

	// console.log('model - accout');
		// var queryString = "SELECT user_name,url,password,protocal FROM jira_accounts";
	
		// sequelize.query(queryString, { type: Sequelize.QueryTypes.UPDATE })
		// .then(function(results){
		// 	callback(results);
		// })
		// .catch(function(err){
	 //  		console.log(err);
	 //  		throw err;
	 //  	});
};

module.exports = Tasks;