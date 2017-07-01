var db 					= require('../db');
var model 				= require('./jiragation');
var Sequelize 			= db.Sequelize;
var sequelize 			= db.sequelize;

var Tasks = function() {

};

Tasks.getTasks = function(req, callback) {
	
	var queryString = "SELECT * FROM tasks t WHERE t.user_id="+req.decoded.id;
	
	sequelize.query(queryString, { type: Sequelize.QueryTypes.SELECT }).then(function(results){
		callback(results);
		// console.log(results);
	}).catch(function(err){
		throw err;
	});

};

Tasks.getTaskById = function(req, callback) {
	// Requires task id
	console.log(req);
	var queryString = "SELECT * FROM tasks t WHERE t.task_id ="+req.body.task_id;
		queryString += " AND t.user_id="+req.decoded.id
	
	sequelize.query(queryString, { type: Sequelize.QueryTypes.SELECT }).then(function(results){
		callback(results);
		// console.log(results);
	}).catch(function(err){
		throw err;
	});	
};

Tasks.getTasksByDate = function(req, callback) {
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
	model.tasks.create({
		task_id: req.body.task_id,
		task_label: req.body.task_label,
		account_id: req.body.account_id,
		priority: req.body.priority,
		date_created: req.body.date_created,
		due_date: req.body.due_date,
		description: req.body.description,
		user_id: req.decoded.id
	}).then(function(results) {
		callback(results);
	}, function(err){
		console.log(err);
		throw err;
	});
};

Tasks.updateTasks = function(callback) {
	// Requires task ID
	sequelize.transaction(function (t) {
		return model.Tasks.update(req, {
			where: {
				task_id:req.task_id,
				user_id: req.decoded.id
			},
			transaction:t
		}).then(function (rows) {
			if(rows < 1){
				return model.Tasks.create({
					task_id: req.task_id,
					task_label: req.task_label,
					account_id: req.account_id,
					priority: req.priority,
					date_created: req.date_created,
					due_date: req.due_date,
					description: req.description,
					user_id: req.decoded.id
				},{transaction:t}).then(function(table){
					return table;
				});
			} else{
				throw 'no data'
			}

		}, function(err){
			throw err;
		});
	}).then(function (user) {
		callback(null,table);
	}).catch(function (error) {
	    callback(error, null);
	});
};

module.exports = Tasks;