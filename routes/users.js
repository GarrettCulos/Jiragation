var express			= require('express');
var users 			= express.Router();
var Users			= require('../models/users');
var fs 				= require('fs');

users.get('/get_user_info', function(req, res, next) { 
	if(res.decoded){
		Users.getUserInformation(req.decodec.id, function(result){
			res.send(result);		
		});	
	}
	else{
		res.status(401).send('Unauthorized Request');
	}
});

users.post('/update_user_info',function(req,res,next) {
	if(req.decoded){
		Users.update(req, function(result){
			res.send(result);		
		});
	}
	else{
		res.status(401).send('Unauthorized Request');
	}
		
});

module.exports.users = users;