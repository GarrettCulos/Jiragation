var db 					= require('../init_db');
var model 				= require('./jiragation');
var Sequelize 			= db.Sequelize;
var sequelize 			= db.sequelize;

var TimeSheet = function() {

};

// Pull Time Sheet
TimeSheet.getTimeSheet = function(req, callback) {
	// console.log('model - accout');
	var queryString = "SELECT * FROM time_sheet ts WHERE ts.user_id ="+req.decoded.id;
	
	sequelize.query(queryString, { type: Sequelize.QueryTypes.SELECT }).then(function(results){
		callback(results);
		// console.log(results);
	}).catch(function(err){
		throw err;
	});

};

TimeSheet.logTaskTime = function(req, callback) {
	model.timeSheet.create({
		task_id: req.body.task_id,
		start_time: req.body.start_time,
		end_time: req.body.end_time,
		user_id: req.decoded.id
	}).then(function(results) {
		callback(results);
	}, function(err){
		throw err;
	});
};

//pull time log for specific task_id
TimeSheet.getTaskTime = function(req, callback) {
	
	var queryString = "SELECT * FROM time_sheet ts WHERE ts.task_id = '" + req.query.task_id + "' AND ts.user_id="+req.decoded.id;
	sequelize.query(queryString, { type: Sequelize.QueryTypes.SELECT }).then(function(results){
		callback(results);
		// console.log(results);
	}).catch(function(err){
  		// console.log(err);
  		throw err;
  	});
};

TimeSheet.getTrackedTime = function(req, callback) {
	// var earlier_Date =  new Date( res.earlier_time);
	// var later_Date  new Date ( res.later_time);
	var queryString  = " SELECT * ";
		queryString += " FROM time_sheet ts ";
		queryString += " WHERE ts.start_time >= '" + new Date(req.query.earlier_time).getTime()/1000 + "' ";
		queryString += " AND ts.start_time <= '" + new Date(req.query.later_time).getTime()/1000 + "' ";
		queryString += " AND ts.user_id ="+req.decoded.id;
		
	sequelize.query(queryString, { type: Sequelize.QueryTypes.SELECT }).then(function(results){
		callback(results);
		// console.log(results);
	}).catch(function(err){
  		// console.log(err);
  		throw err;
  	});
};


module.exports = TimeSheet;