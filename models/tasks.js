var db 					= require('../init_db');
var model 				= require('./jiragation');
var Sequelize 			= db.Sequelize;
var sequelize 			= db.sequelize;

var Tasks = function() {

};

Tasks.getTasks = function(callback) {
	
	var queryString = "SELECT * FROM tasks";
	
	sequelize.query(queryString, { type: Sequelize.QueryTypes.SELECT })
	.then(function(results){
		callback(results);
		// console.log(results);
	})
	.catch(function(err){
  		console.log(err);
  		throw err;
  	});

};

Tasks.getTaskById = function(req, callback) {
	// Requires task id
	console.log(req);
	var queryString = "SELECT * FROM tasks WHERE tasks.task_id ="+req.task_id;
	
	sequelize.query(queryString, { type: Sequelize.QueryTypes.SELECT })
	.then(function(results){
		callback(results);
		// console.log(results);
	})
	.catch(function(err){
  		console.log(err);
  		throw err;
  	});

	
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

Tasks.addTasks = function(req, callback) {
	// Req Nothing.
	
	model.Tasks.create({
		task_id: req.task_id,
		task_label: req.task_label,
		account_id: req.account_id,
		priority: req.priority,
		date_created: req.date_created,
		due_date: req.due_date,
		description: req.description
	}).then(function(results) {
		callback(results);
	}, function(err){
		console.log(err);
		throw err;
	});

};

Tasks.updateTasks = function(callback) {
	// Requires task ID
	
	model.Tasks.update(req, {
		where: {
			task_id:req.task_id	
		}
	})
	.then(function (rows) {
		if(rows < 1){
			model.Tasks.create({
				task_id: req.task_id,
				task_label: req.task_label,
				account_id: req.account_id,
				priority: req.priority,
				date_created: req.date_created,
				due_date: req.due_date,
				description: req.description
			}).then(function(table){
				callback(null,table);
			});
		} else{
			callback(null,rows);			
		}

	}, function(err){
		console.log(err);
	});	
};

module.exports = Tasks;