var express			= require('express');
var users 			= express.Router();
var Users			= require('../models/users');
var fs 				= require('fs');

users.get('/get_user_info', function(req, res, next) { 
	Users.getUser(function(result){
		res.send(result);		
	});
});

users.post('/update_user_info',function(req,res,next) {
	var user_info = req.body;
	Users.setUserInfo(user_info, function(result){
		res.send(result);		
	});
});

module.exports.users = users;