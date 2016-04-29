var express 			= require('express');
var taskManager			= express.Router();
var TimeSheet			= require('../models/time_sheet.js');
var fs 					= require('fs');

taskManager.post('/trackTime', function(req, res, next) {
	TimeSheet.logTaskTime(req.body, function(req, result) {
		// console.log(result); 
		res.send(result);		
	});
});

taskManager.get('/getTaskTime',function(req, res, next) {
	// console.log(JSON.parse(req.query));
	TimeSheet.getTaskTime(req.query, function(result) {
		res.send(result);
	});
})

taskManager.post('/add_accounts',function(req, res, next) {
	var account = req.account;
	Accounts.setAccount(account, function(result) {
		// console.log('Account Set');
		res.send(result);		
	});
})

module.exports.taskManager = taskManager;