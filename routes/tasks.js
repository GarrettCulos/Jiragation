var express 		= require('express');
var tasks 			= express.Router();
var Tasks 			= require('../models/tasks');
var fs 				= require('fs');

tasks.get('/get_tasks', function(req, res) { 
	if(req.decoded!= null){
		Tasks.getTasks(req, function(result){
			res.send(result);		
		});
	}
	else{
		res.status(401).send('Unauthorized Request');
	}
});

tasks.get('/get_tasks_by_id', function(req, res) { 
	if(req.decoded!= null){
		Tasks.getTaskById(req, function(result){
			res.send(result);		
		});
	}
	else{
		res.status(401).send('Unauthorized Request');
	}
});

tasks.get('/get_tasks_by_date', function(req, res,) { 
	if(req.decoded!= null){
		Tasks.getTasksByDate(req, function(result){
			res.send(result);		
		});
	}
	else{
		res.status(401).send('Unauthorized Request');
	}
});


tasks.post('/add_task',function(req,res) {
	if(req.decoded!= null){
		Tasks.addTask(req, function(result){
			res.send(result);		
		});
	}
	else{
		res.status(401).send('Unauthorized Request');
	}
});

tasks.post('/udpate_task_by_id',function(req,res) {
	if(req.decoded!= null){
		Tasks.updateTasksById(req, function(result){
			res.send(result);		
		});
	}
	else{
		res.status(401).send('Unauthorized Request');
	}
});

tasks.post('/remove_task_by_id',function(req,res) {
	if(req.decoded!= null){
		Tasks.removeTaskById(req, function(result){
			res.send(result);		
		});
	}
	else{
		res.status(401).send('Unauthorized Request');
	}
});
module.exports.tasks = tasks;