var express 			= require('express');
var accounts 			= express.Router();
var Accounts 			= require('../models/accounts');
var fs 					= require('fs');

accounts.get('/fetch_accounts', function(req, res, next) {
	if(req.decoded != null){
		Accounts.getAccounts(req, function(result){
			// console.log('routes - accout');
			res.send(result);		
		});
	}
	else{
		res.status(401).send('You do not have access to that');
	}
});

accounts.get('/is_current_user', function(req, res, next) { 
	if(req.decoded){
		Accounts.verifyUserAccount(req, function(result){
			// console.log('routes - accout');
			res.send(result);		
		});
	}
	else{
		res.status(401).send('You do not have access to that');
	}
});


accounts.post('/add_account',function(req,res,next) {
	if(req.decoded){
		Accounts.setAccount(req, function(result){
			// console.log('Account Set');
			res.send(result);		
		});
	}
	else{
		res.status(401).send('You do not have access to that');
	}
});

accounts.post('/remove_account',function(req,res,next) {
	if(req.decoded){
		Accounts.removeAccount(req, function(result){
			// console.log('Account Set');
			res.send(result);		
		});
	}
	else{
		res.status(401).send('You do not have access to that');
	}
});
module.exports.accounts = accounts;