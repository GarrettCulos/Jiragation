var env 		= process.env.NODE_ENV || "development";
var config 		= require('../config/config.json')[env];
var passwords	= require('../config/disallowedPasswords');
var db 			= require('../db');
var model		= require('./jiragation');
var bcrypt		= require('bcryptjs');
var Sequelize 	= db.Sequelize;
var sequelize 	= db.sequelize;

var Users = function(){ };

Users.getUser = function(user_name, callback){
	sequelize.query( "SELECT id, user_name, password, is_admin FROM users WHERE user_name='"+user_name+"'", {
		type: Sequelize.QueryTypes.select
	}).then(function(results){
		callback(null, results[0][0]);
	}, function(err){
		callback(err, null)
	});
}

Users.getUserInformation = function(user_id, callback){
	selectQuery = " SELECT "
	selectQuery +=" u.id as `id`, "
	selectQuery +=" u.user_name as `user_name`, "
	selectQuery +=" u.email_address as `user_email`, "
	selectQuery +=" u.first_name as `first_name`, "
	selectQuery +=" u.last_name as `last_name`, "
	selectQuery +=" u.is_admin as `is_admin` " 
	selectQuery +=" FROM users u "
	selectQuery +=" WHERE u.id="+user_id;
	
	sequelize.query( selectQuery, {type: Sequelize.QueryTypes.select}).then(function(results){
		callback(null, results[0][0]);
	}, function(err){
		callback(err, null)
	});
}

Users.getUserByUserName = function(user_name,callback){
	selectQuery = " SELECT "
	selectQuery +=" u.user_name as `user_name`,"
	selectQuery +=" u.email_address as `user_email`,"
	selectQuery +=" u.first_name as `first_name`,"
	selectQuery +=" u.last_name as `last_name`,"
	selectQuery +=" u.is_admin as `is_admin`" 
	selectQuery +=" FROM users u"
	selectQuery +=" WHERE u.user_name ='"+user_name+"'";

	sequelize.query( selectQuery, {type: Sequelize.QueryTypes.select}).then(function(results){
		callback(null, results[0][0]);
	}, function(err){
		callback(err, null)
	});
}
Users.getUserByEmail = function(email_address,callback){
	selectQuery = " SELECT "
	selectQuery +=" u.user_name as `user_name`,"
	selectQuery +=" u.email_address as `user_email`,"
	selectQuery +=" u.first_name as `first_name`,"
	selectQuery +=" u.last_name as `last_name`,"
	selectQuery +=" u.is_admin as `is_admin`" 
	selectQuery +=" FROM users u"
	selectQuery +=" WHERE u.email_address ='"+email_address+"'";

	sequelize.query( selectQuery, {type: Sequelize.QueryTypes.select}).then(function(results){
		callback(null, results[0][0]);
	}, function(err){
		callback(err, null)
	});
}

Users.add = function(user, callback) {
	var errors = [];
	var warnings = [];
	var easy_passwords = passwords.passwords();
	
	// check password is not too simple.
	if(easy_passwords.indexOf(user.password)!= -1 || user.password.length <= 5){
		errors.push({message: 'The password you\'ve selected is to simple.', type:'password'});
		return callback(errors, null);
	}

	// Check that password and confirmation password are equal
	if(user.password !== user.passwordConfirm) {
		errors.push({message : 'Password and confirmation password are not the same.', type:'password'});
		return callback(errors, null);
	}

	// Hash user's password and replace with given one
	try {
		user.password = this.hashPassword(user.password);
	} catch(err) {
		errors.push({message:'Password field must be set.',type:'password'});
		return callback(errors, null);
	}


	// check email is unique
	user.is_admin = 0;
	user.is_active = 1;
	user.join_date = new Date();

	// Add user to database
	Users.getUserByEmail(user.email_address, function(no_user,user_exists){

		if(user_exists){
			errors.push({message:'This email address is already registerd to a user.', type:'email'});
			return callback(errors, null);
		}
		else{
			Users.getUserByUserName(user.user_name, function(no_user,user_exists){
				if(user_exists){
					errors.push({message:'This username already exists.', type:'user_name'})
					return callback(errors, null);
				}
				else{
					sequelize.transaction(function (t) {
					    return model.users.create(user, {transaction: t}).then(function(newUser) {
					        return newUser;
					    });
					}).then(function (user) {
						// return user information
						if(user.data){
							return callback(user.data.messages, null);
						}
						else{
							return Users.getUserInformation(user.dataValues.id, function(err, finalUser) {
					            if(err){
					            	return callback(err, null);
					            }
					            return callback(null, finalUser);
					        });
				    	}
				    }).catch(function (error) {
				        return callback(error, null);
				    });
				}
			});
    	}
    });
};

Users.update = function(user, callback){
	// same as add execpt sequalize update 
	var errors = [];
	var warnings = [];
	var easy_passwords = passwords.passwords();

	if(user.password && user.passwordConfirm){		
		// check password is not too simple.
		if(easy_passwords.indexOf(user.password)!= -1 || user.password.length <= 5){
			errors.push({message: 'The password you\'ve selected is to simple.', type:'password'});
			return callback(errors, null);
		}

		// Check that password and confirmation password are equal
	    if(user.password !== user.passwordConfirm) {
	        errors.push({message : 'Password and confirmation password are not the same.', type:'password'});
	        return callback(errors, null);
	    }

	 	// Hash user's password and replace with given one
		try {
		    user.password = this.hashPassword(user.password);
		} catch(err) {
		    errors.push({message:'Password field must be set.',type:'password'});
		    return callback(errors, null);
		}
	}


	// check email is unique
	user.is_admin = 0;
	user.is_active = 0;

  	// Add user to database
  	if(user.email_address){
	  	Users.getUserByEmail(user.email_address, function(no_user,user_exists){
	    	if(user_exists){
	    		errors.push({message:'This email address is already registerd to a user.', type:'email'});
	    		return callback(errors, null);
	    	}	
	    });
	}
  
  	if(user.user_name){
		Users.getUserByUserName(user.user_name, function(no_user,user_exists){
			if(user_exists){
				errors.push({message:'This username already exists.', type:'user_name'});
				return callback(errors, null);
			}
    	});
	}


	sequelize.transaction(function (t) {
		return model.users.update(user,{
			where:{ 
				id: user.id 
			},
			transaction: t
		}).then(function(newUser) {
			return newUser;
		});
	}).then(function (u) {
  	// return user information
	  	if(u.data){
	  		return callback(u.data.messages, null);
	  	}
		else{
			return Users.getUserInformation(u[0], function(err, finalUser) {
		        if(err){
		        	return callback(err, null);
		        }
		        else{
		        	return callback(null, finalUser);
		        }
	     	});
	  	}
  	}).catch(function (error) {
		return callback(error, null);
  	});
}

Users.hashPassword = function(potato){
	var salt = bcrypt.genSaltSync(10);
	var breakfast = bcrypt.hashSync(potato,salt);
	//salt + hash =  return breakfast
	return breakfast;
}

Users.verifyPassword = function(rawPassword, user){
	// user is what the database returns when ``user = model.User.find(id).then(function(user){ return user }) is called``
	brcypt.compareSync(rawPassword,user.get('password'));
}

module.exports = Users;