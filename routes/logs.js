var express 			= require('express');
var logs 				= express.Router();
var Accounts 			= require('../models/accounts');
var fs 					= require('fs');

logs.get('/fetch_accounts', function(req, res) { 
	if(req.decoded !=null){
		Accounts.getAccounts(req, function(result){
			res.send(result);		
		});
	}
	else{
		res.status(401).send('You do not have the proper authorization');
	}
});

logs.post('/add_account',function(req,res) {
	if(req.decoded !=null){
		Accounts.setAccount(req, function(result){
			res.send(result);		
		});
	}
	else{
		res.status(401).send('You do not have the proper authorization');
	}
});

logs.delete('/remove_account',function(req,res) {
	if(req.decoded !=null){
		Accounts.removeAccount(req, function(result){
			res.send(result);		
		});
	}
	else{
		res.status(401).send('You do not have the proper authorization');
	}
});

module.exports.logs = logs;