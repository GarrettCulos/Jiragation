var db 					= require('../init_db.js');

var Sequelize 			= db.Sequelize;

var sequelize 			= db.sequelize;

var TimeSheet = function() {

};

// Pull Time Sheet
TimeSheet.getTaskTime = function(callback) {
	// console.log('model - accout');
	var queryString = "SELECT * FROM timeSheet";
	
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

	var queryString = "INSERT req.ask_id, req.start_time , req.logged_time FROM timeSheet";
	/* Insert account into database table */
	sequelize.query(queryString, { type: Sequelize.QueryTypes.INSERT })
		.then(function(results){
			callback(results);
			// console.log(results);
		})
		.catch(function(err){
	  		console.log(err);
	  		throw err;
	  	});

};

//pull time log for specific task_id
TimeSheet.getTaskTime = function(taskID, callback) {
	// console.log('model - accout');
	var queryString = "SELECT * FROM timeSheet WHERE task_id as taskID";
	
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