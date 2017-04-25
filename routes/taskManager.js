var express 			= require('express');
var async				= require('async');
var taskManager			= express.Router();
var TimeSheet			= require('../models/time_sheet.js');
var fs 					= require('fs');

taskManager.post('/trackTime', function(req, res, next) {
	if(req.decoded != null){
		req.body.start_time = new Date(req.body.start_time).getTime();
		req.body.end_time = new Date(req.body.end_time).getTime();

		// console.log('start_time',req.body.start_time);
		TimeSheet.logTaskTime(req, function(result) {
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
		
		if(req.query.start_time == null){
			var	date = new Date();
			req.query.start_time = new Date(date.getFullYear()+"/"+(date.getMonth()+1)+"/"+date.getDate()+" 00:00:00").getTime();
			// console.log(new Date(req.query.start_time));
			// console.log(req.query.start_time);	
		}
		
		if(req.query.end_time == null){
			var	date = new Date();
			req.query.end_time = new Date(date.getFullYear()+"/"+(date.getMonth()+1)+"/"+date.getDate()+" 24:00:00").getTime();
		}

		TimeSheet.getTaskTime(req, function(log) {
			res.send({logged_time:log[0].logged_time});
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