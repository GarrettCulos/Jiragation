var express 			= require('express');

var jira				= express.Router();

var Accounts 			= require('../models/accounts');

var fs 					= require('fs');

const http 				= require('http');

const https 			= require('https');

jira.get('/jira_accounts', function(req, res, next) { 
	
	function jira_callback(res,tasks) { 
		res.send(tasks); 
	}

	var user_accounts = [];
	var tasks = [];

	Accounts.getAccounts(function(result){
		// console.log('routes - accout');
		user_accounts = result;

		var loop = user_accounts.map(function(acct) { 		/* Loop Through accounts (user_accounts as acct) */

			var options = {
				method: 'GET',
				host: acct.url,
				path: '/rest/api/2/search?jql=assignee='+ acct.user_name + '+order+by+duedate',
				headers:{
					'Content-Type':  'application/json',
					'Authorization': 'Basic '+ new Buffer( acct.user_name + ':' + acct.password ).toString('base64')
				}
			};

   			// console.log(options);
   			if(acct.protocal === "https"){
				
				var jira_request =	https.get(options, function(res) {

				    console.log("statusCode: ", res.statusCode);
				    // console.log("headers: ", res.headers);

				    res.on('data', function(d) {
		
				        // process.stdout.write(d);
				        // console.log(d);
				    });

				}).on('error', (e) => {
					console.error(e);	
				});

	   		}else{

	   			var jira_request =	http.get(options, function(res) {

				    console.log("statusCode: ", res.statusCode);
				    // console.log("headers: ", res.headers);
				    var tasks = [];
				    
				    res.on('data', function(d) {
				    	tasks.push(d);
						// console.log(d);
				        // process.stdout.write(d);
				        // console.log(d);
				    }).on('end', function() {
						tasks=Buffer.concat(tasks).toString();
						// console.log(task);
					});

				}).on('error', (e) => {
					console.error(e);	
				});

   			}

			
		}, function(err) {
		    
		    console.log('iterating done');

		})

		loop.then(()=>{
			console.log(tasks);
			res.send(tasks);
		}); /* end loop */
	});
});


module.exports.jira = jira;