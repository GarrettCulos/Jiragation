var express 			= require('express');

var jira				= express.Router();

var Accounts 			= require('../models/accounts');

var fs 					= require('fs');

const http 				= require('http');

const https 			= require('https');

jira.get('/jira_accounts', function(req, res, next) { 
	
	var user_accounts = [];
	var tasks = [];

	Accounts.getAccounts(function(result){
		// console.log('routes - accout');
		user_accounts = result;

		user_accounts.forEach(function(acct) { 		/* Loop Through accounts (user_accounts as acct) */

			var options = {
				method: 'GET',
				host: acct.url,
				path: '/rest/api/2/search?jql=assignee='+ acct.user_name + '+order+by+duedate',
				headers:{
					'Content-Type':  'application/json',
					'Authorization': 'Basic '+ new Buffer( acct.user_name + ':' + acct.password ).toString('base64')
				}
			};

   			console.log(options);
   			if(acct.protocal === 'https'){
				
				var jira_request =	https.get(options, function(res) {

				    console.log("statusCode: ", res.statusCode);
				    // console.log("headers: ", res.headers);

				    res.on('data', function(d) {
		
				        // process.stdout.write(d);
				        // console.log(d);
				    });

				    res.on('done',function(r){
				    	console.log('finished request');
				    	tasks.push(r);
				    });
				}).on('error', (e) => {
					console.error(e);	
				});

	   		}else{

	   			var jira_request =	http.get(options, function(res) {

				    console.log("statusCode: ", res.statusCode);
				    // console.log("headers: ", res.headers);

				    res.on('data', function(d) {

				        // process.stdout.write(d);
				        // console.log(d);
				    });

				    res.on('done',function(r){
				    	console.log('finished request');
				    	tasks.push(r);
				    });

				}).on('error', (e) => {
					console.error(e);	
				});
	
   			}
			
		}, function(err) {
		    
		    console.log('iterating done');

		}); 
	});/* end loop */
});


module.exports.jira = jira;