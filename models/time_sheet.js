var db 					= require('../init_db');
var model 				= require('./jiragation');

var Sequelize 			= db.Sequelize;

var sequelize 			= db.sequelize;

var TimeSheet = function() {

};

// Pull Time Sheet
TimeSheet.getTaskTime = function(callback) {
	// console.log('model - accout');
	var queryString = "SELECT * FROM TimeSheet";
	
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

// Pull time log for towards task_id
TimeSheet.logTaskTime = function(req, callback) {
	console.log(req);
	// model.TimeSheet.sync().then(function () {
		model.TimeSheet.create({
			task_id: req['task_id'],
			end_time: req['end_time'],
			logged_time: req['logged_time'],
		}).then(function () {
			console.log('logged time');
		}, function(err){
			console.log('~logged time');
		});
	// });
};

//pull time log for specific task_id
TimeSheet.getTaskTime = function(taskID, callback) {
	// console.log('model - accout');
	var queryString = "SELECT * FROM TimeSheet WHERE task_id as taskID";
	
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

module.exports = TimeSheet;