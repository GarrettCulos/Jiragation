var express 			= require('express');

var jira				= express.Router();

var Accounts 			= require('../models/accounts');

var fs 					= require('fs');

const http 				= require('http');

const https 				= require('https');

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

   			// console.log(options);
   			console.log(acct.url.substr(0,5))

   			if(acct.url.substr(0,5) === 'https'){
				
				var jira_request =	https.request(options, function(res) {

				    // console.log("statusCode: ", res.statusCode);
				    // console.log("headers: ", res.headers);

				    result.on('data', function(d) {
				
				        process.stdout.write(d);
				        console.log(d);
	
				    });
				});
				
	   		}else{

	   			var jira_request =	http.request(options, function(result) {

				    console.log("statusCode: ", result.statusCode);
				    console.log("headers: ", result.headers);

				    result.on('data', function(d) {
				
				        process.stdout.write(d);
				        console.log(d);
				
				    });
				});
	
   			}
			
		}, function(err) {
		    
		    console.log('iterating done');

		}); 
	});/* end loop */
});


module.exports.jira = jira;