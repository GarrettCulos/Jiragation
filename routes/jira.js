var env           		= process.env.NODE_ENV || "development";
var config        		= require('../config/config.json')[env];
var express 			= require('express');
var jira				= express.Router();
var Accounts 			= require('../models/accounts');
var async				= require('async');
var cryptoJS 			= require('crypto-js');
var JiraC 				= require('../services').jira;
var fs 					= require('fs');
const http 				= require('http');
const https 			= require('https');
const querystring 		= require('querystring');

function taskListToArray(array){
	var res =[];

	array.forEach(function(taskList){
		res = res.concat(taskList.issues);
	});
	console.log(res);
	return res;
};

jira.get('/add_comments', function(req,res) {
	var data = req.query;
	var account = JSON.parse(data.acct);
	var post_data = '{"body":"'+data.body+'"}';
	var basic_authBytes  = cryptoJS.AES.decrypt(account.basic_auth, config.secret);
	var basic_auth = basic_authBytes.toString(cryptoJS.enc.Utf8);
	var options = {
		method: 'POST',
		host: account.url,
		path: '/rest/api/2/issue/'+ data.issueId +'/comment',
		headers:{
			'Content-Type':  'application/json',
			'Content-Length': Buffer.byteLength(post_data),
			'Authorization': 'Basic '+ basic_auth
		}
	};

	var requestData = {};
	requestData.post_data = post_data;
	requestData.account = account;

	JiraC.jiraRequest(options, requestData, function(response){
		res.status(200).send(response);
	}, function(error){
		res.status(404).send(error);
	});
});

jira.get('/task_comments', function(req,res) {
	var data = req.query;
	var account = JSON.parse(data.acct);
	var basic_authBytes  = cryptoJS.AES.decrypt(account.basic_auth, config.secret);
	var basic_auth = basic_authBytes.toString(cryptoJS.enc.Utf8);
	var options = {
		rejectUnauthorized: false,
		method: 'GET',
		host: account.url,
		path: '/rest/api/2/issue/'+ data.issueId +'/comment',
		headers:{
			'Content-Type':  'application/json',
			'Authorization': 'Basic '+ basic_auth
		}
	};
	var requestData = {};
	requestData.account = account;

 	JiraC.jiraRequest(options, requestData, function(response){
		res.status(200).send(response);
	}, function(error){
		res.status(404).send(error);
	});
});

jira.get('/jira_accounts', function(req, res) { 
	Accounts.getAccounts(req, function(accts){
		// console.log('routes - accout');
		var tasks_list = [];
		var loop_count = 0;
		var user_accounts = accts;

		async.forEach(user_accounts, function(acct, next2){

			var basic_authBytes  = cryptoJS.AES.decrypt(acct.basic_auth.toString(), config.secret);
			var basic_auth = basic_authBytes.toString(cryptoJS.enc.Utf8);
			var options = {
				rejectUnauthorized: false,
				method: 'GET',
				host: acct.url,
				path: '/rest/api/latest/search?jql=assignee='+ acct.user_name + '+order+by+duedate',
				headers:{
					'Content-Type':  'application/json',
					'Authorization': 'Basic '+ basic_auth
				}
			};
			
			var requestData = {};
			requestData.account = acct;
			
		   	JiraC.jiraRequest(options, requestData, function(response){
		   		tasks_list.push(JSON.parse(response));
		   		next2();
			}, function(error){
				// console.log('error getting accout',error)
				next2();
			});
		}, function(finished){
			res.status(200).send(tasks_list.map((e)=> {return e.issues})[0]);	
		});
	});
});

jira.post('/logTime', function(req,res){
	Accounts.getAccountsById(req, function(account){

		var post_data = JSON.stringify({
				timeSpentSeconds: req.body.time*60,
				visibility: {
			        type: 'group',
			        value: "jira-developers"
			    },
				started: req.body.date, 
				comment: req.body.comment
		})
		var basic_authBytes  = cryptoJS.AES.decrypt(account.basic_auth, config.secret);
		var basic_auth = basic_authBytes.toString(cryptoJS.enc.Utf8);
		var options = {
			rejectUnauthorized: false,
			method: "POST",
			host:account.url,
			path: "/rest/api/2/issue/"+ req.body.task_id+"/worklog",
			headers:{
				"Content-Type": "application/json",
				"Content-Length": Buffer.byteLength(post_data),
				"Authorization": "Basic "+ basic_auth
			}
		};
		var requestData = {};
		requestData.post_data = post_data;
		requestData.account = account;

		JiraC.jiraRequest(options, requestData, function(response){
	   		res.status(200).send(response);
		}, function(error){
	   		res.status(404).send(error);
		});
	});
});

module.exports.jira = jira;