var express 			= require('express');
var jira				= express.Router();
var Accounts 			= require('../models/accounts');
var fs 					= require('fs');
const http 				= require('http');
const https 			= require('https');

function taskListToArray(array){
	var res =[];
	array.forEach(function(taskList){
		res = res.concat(taskList.issues);
		// console.log(res);
	});
	return res;
};


jira.get('/task_comments', function(req,res,next) {
	var data = req.body;

	var options = {
		rejectUnauthorized: false,
		method: 'GET',
		host: data.acct.url,
		path: '/rest/api/2/issue/'+ data.issueId +'/comment',
		headers:{
			'Content-Type':  'application/json',
			'Authorization': 'Basic '+ new Buffer( data.acct.user_name + ':' + data.acct.password ).toString('base64')
		}
	};
		
   	if(acct.protocal === "http"){

   		http.get(options, function(response) {
			console.log(response);
			res.json(response);
		}).on('error', (error) => {
			console.error(error);	
		});

   	} else {

		https.get(options, function(response) {	
			console.log(response);
		  	res.json(response);
		}).on('error', (error) => {
			console.error(error);	
		});
   		
   	}

});

jira.get('/jira_accounts', function(req, res, next) { 
	
	var user_accounts = [];

	Accounts.getAccounts(function(accts){
		// console.log('routes - accout');
		var tasks_list = [];
		var loop_count = 0;
		user_accounts = accts;

		function get_jira_accounts(r, acct){
			var tasks = [];
	    
		    r.on('data', function(d) {
		    	tasks.push(d);
		    }).on('end', function() {
				
				tasks_list.push(JSON.parse(Buffer.concat(tasks).toString()));
				// console.log(tasks_list);
				loop_count=loop_count+1;
				// console.log('http request complete');
				if(loop_count == Object.keys(user_accounts).length){
	   				console.log(taskListToArray(tasks_list,acct));
	   				console.log('Return tasks');
	   				res.json(taskListToArray(tasks_list, acct));
	   			}
			});
	  	}

		user_accounts.forEach(function(acct) { 		/* Loop Through accounts (user_accounts as acct) */

			var options = {
				rejectUnauthorized: false,
				method: 'GET',
				host: acct.url,
				path: '/rest/api/latest/search?jql=assignee='+ acct.user_name + '+order+by+duedate',
				headers:{
					'Content-Type':  'application/json',
					'Authorization': 'Basic '+ new Buffer( acct.user_name + ':' + acct.password ).toString('base64')
				}
			};
			
		   	if(acct.protocal === "http"){
		   		http.get(options, function(response) {
				  get_jira_accounts(response, acct);
				}).on('error', (error) => {
					console.error(error);	
				});

		   	} else {
				https.get(options, function(response) {
					get_jira_accounts(response, acct);
				}).on('error', (error) => {
					console.error(error);	
				});
		   		
		   	}

		}, function(err) {
		    
		    console.log('iterating done');
		
		}); /* end loop */

	});
	
});


module.exports.jira = jira;