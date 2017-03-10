var express 			= require('express');
var async				= require('async');
var taskManager			= express.Router();
var TimeSheet			= require('../models/time_sheet.js');
var fs 					= require('fs');

taskManager.post('/trackTime', function(req, res, next) {
	if(req.decoded != null){
		TimeSheet.logTaskTime(req, function(req, result) {
			// console.log(result); 
			res.send(result);		
		});
	}
	else{
		res.status(401).send('Unauthorized Request');
	}
});

taskManager.get('/getTrackedTime',function(req, res, next) {
	if(req.decoded != null){
		TimeSheet.getTrackedTime(req, function(time_logs) {
			res.send({time_logs: time_logs});
		});
	}
	else{
		res.status(401).send('Unauthorized Request');
	}
});

taskManager.get('/getTaskTime',function(req, res, next) {
	if(req.decoded != null){
		TimeSheet.getTaskTime(req, function(time_logs) {
			var todays_logged_time=0;
			var	date = new Date();
			var todays_date = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

			async.forEach(time_logs,function(time_log,callback){
				if(time_log.start_time> todays_date){
					todays_logged_time = todays_logged_time + (parseInt(time_log.end_time)-parseInt(time_log.start_time));
				}
				callback(null,todays_logged_time);
			}, function(err){
				if(err){ throw err}
				res.send({logged_time:todays_logged_time});
			});
		});
	}
	else{
		res.status(401).send('Unauthorized Request');
	}
});

taskManager.post('/add_accounts',function(req, res, next) {
	if(req.decoded != null){
		Accounts.setAccount(req, function(result) {
			// console.log('Account Set');
			res.send(result);		
		});
	}
	else{
		res.status(401).send('Unauthorized Request');
	}
});

module.exports.taskManager = taskManager;