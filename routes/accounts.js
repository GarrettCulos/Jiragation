var express 			= require('express');
var accounts 			= express.Router();
var Accounts 			= require('../models/accounts');
var fs 					= require('fs');

accounts.get('/fetch_accounts', function(req, res, next) { 
	Accounts.getAccounts(function(result){
		// console.log('routes - accout');
		res.send(result);		
	});
});

accounts.post('/add_accounts',function(req,res,next) {
	var account = req.account;
	Accounts.setAccount(account, function(result){
		// console.log('Account Set');
		res.send(result);		
	});
});

module.exports.accounts = accounts;