var express 			= require('express');

var jira				= express.Router();

var Accounts 			= require('../models/accounts');

var fs 					= require('fs');

const http 				= require('http');

const https 			= require('https');

jira.get('/jira_accounts', function(req, res, next) { 
	
	var user_accounts = [];
	var tasks = [];
	
	function return_tasks(t){
		console.log(t);
		res.send(t);
		// console.log(res.send(t))
	};

	Accounts.getAccounts(function(result){
		// console.log('routes - accout');
		var loop_count = 0;
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

   			http.get(options, function(r) {

			    // console.log("statusCode: ", res.statusCode);
			    // console.log("headers: ", res.headers);
			    var tasks = [];
			    
			    r.on('data', function(d) {
			    	tasks.push(d);
					// console.log(d);
			        // process.stdout.write(d);
			        // console.log(d);
			    }).on('end', function() {
					tasks=Buffer.concat(tasks).toString();
					loop_count=loop_count+1;
					if(loop_count == Object.keys(user_accounts).length){
		   				console.log('Return tasks');
		   				return_tasks(tasks);
		   			}
				});

			}).on('error', (e) => {
				console.error(e);	
			});
			
		}, function(err) {
		    
		    console.log('iterating done');
		
		}); /* end loop */
	});
});


module.exports.jira = jira;