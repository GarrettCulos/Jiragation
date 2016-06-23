var express 			= require('express');
var tasks 			= express.Router();
var Tasks 			= require('../models/tasks');
var fs 					= require('fs');

tasks.get('/get_local_tasks', function(req, res, next) { 
	Tasks.getTasks(function(result){
		// console.log('routes - accout');
		res.send(result);		
	});
});

tasks.get('/get_local_tasks_by_id', function(req, res, next) { 
	var task_id = req.body;
	Tasks.getTaskById(task_id, function(result){
		// console.log('routes - accout');
		res.send(result);		
	});
});

tasks.get('/get_local_tasks_by_date', function(req, res, next) { 
	var dates = req.body;
	Tasks.getTasksByDate(dates, function(result){
		// console.log('routes - accout');
		res.send(result);		
	});
});


tasks.post('/add_task',function(req,res,next) {
	var task_data = req.body;
	Tasks.addTask(task_data, function(result){
		// console.log('Account Set');
		res.send(result);		
	});
});

tasks.post('/udpate_task_by_id',function(req,res,next) {
	var task_id = req.body;
	Tasks.updateTasksById(task_id, function(result){
		// console.log('Account Set');
		res.send(result);		
	});
});

tasks.post('/remove_task_by_id',function(req,res,next) {
	var task_id = req.body;
	Tasks.removeTaskById(task_id, function(result){
		// console.log('Account Set');
		res.send(result);		
	});
});
module.exports.tasks = tasks;