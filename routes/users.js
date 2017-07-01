var express			= require('express');
var users 			= express.Router();
var Users			= require('../models/users');
var fs 				= require('fs');

users.get('/get_user_info', function(req, res) { 
	if(res.decoded!=null){
		Users.getUserInformation(req.decodec.id, function(result){
			res.send(result);		
		});	
	}
	else{
		res.status(401).send('Unauthorized Request');
	}
});
users.post('/update', function(req,res) {
	if(req.decoded != null){
    	Users.update(req.body.user,function(error, response){
      		if(error){
        		return res.status(400).send(error);
      		}
      		else{
		        req.body.password = req.body.passwordConfirm
		        delete req.body.passwordConfirm
		        res.send(req.body);
      		}
    	});
  	}
  	else{
		res.status(401).send('Unauthorized Request');
	}
}); 

users.get('/getUserInformation', function(req,res) {
	if(req.decoded!=null){
		Users.getUserInformation(req.decoded.id, function(err, result){
			if(err){
				return res.status(400).send(err)
			}
			res.send(result);
		});
	}
	else{
		res.status(401).send('Unauthorized Request');
	}
});

module.exports.users = users;