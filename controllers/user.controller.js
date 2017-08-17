var env                 = process.env.NODE_ENV || "development";
var config              = require('../config/config.json')[env];
var passwords           = require('../config/disallowedPasswords');
var db                  = require('../db');
var model               = require('../modelsV2');
var JiraC               = require('../services').jira;

var winston             = require('winston');
var jwt                 = require('jsonwebtoken');
var bcrypt              = require('bcryptjs');

var Sequelize           = db.Sequelize;
var sequelize           = db.sequelize;

// POST: /api/user
/*Create user*/

// PUBLIC FUNCTIONS
exports.create = function(req, res) {
    var user = req.body;
    var errors = [];
    var warnings = [];
    var easy_passwords = passwords.passwords();
    
    // check password is not too simple.
    if(easy_passwords.indexOf(user.password)!= -1 || user.password.length <= 5){
        errors.push({message: 'The password you\'ve selected is to simple.', type:'password'});
        return res.status(400).send({
            data:errors,
            message:null
        });
        
    }

    // Check that password and confirmation password are equal
    if(user.password !== user.passwordConfirm) {
        errors.push({message : 'Password and confirmation password are not the same.', type:'password'});
        return res.status(400).send({
            data:errors,
            message:null
        });
        
    }

    // Hash user's password and replace with given one
    try {
        user.password = this.hashPassword(user.password);
    } catch(err) {
        errors.push({message:'Password field must be set.',type:'password'});
        return res.status(400).send({
            data:errors,
            message:null
        });
        
    }


    // check email is unique
    user.is_admin = 0;
    user.is_active = 1;
    user.join_date = new Date();

    // Add user to database
    Users.getUserByEmail(user.email_address, function(no_user,user_exists){

        if(user_exists){
            errors.push({message:'This email address is already registerd to a user.', type:'email'});
            return res.status(400).send({
                data:errors,
                message:null
            });
        }
        else{
            Users.getUserByUserName(user.user_name, function(no_user, user_exists){
                if(user_exists){
                    errors.push({message:'This username already exists.', type:'user_name'})
                    return res.status(400).send({
                        data:errors,
                        message:null
                    });
                }
                else{
                    sequelize.transaction(function (t) {
                        return model.users.create(user, {transaction: t}).then(function(newUser) {
                            return newUser;
                        });
                    }).then(function (user) {
                        // return user information
                        if(user.data){
                            return res.status(200).send({
                                data:user.data,
                                message:'Registration successful'
                            });
                        }
                        else{
                            Users.getUserInformation(user.dataValues.id, function(err, finalUser) {
                                if(err){
                                    return res.status(400).send({
                                        data:err,
                                        message:'Failed to retrieve user data'
                                    });
                                }
                                
                                var token = jwt.sign(finalUser, config.secret, {
                                    expiresIn: 1440*60 // expires in 24 hours
                                });

                                // return the information including token as JSON
                                return res.send({
                                    message: 'Enjoy your token!',
                                    token: token
                                });
                            });
                        }
                    }).catch(function (error) {
                        console.log(error)
                        return res.status(400).send({
                            data:error,
                            message:null
                        });
                        
                    });
                }
            });
        }
    });
};

exports.update = function(req, res){
    // same as add execpt sequalize update 
    var errors = [];
    var warnings = [];
    var easy_passwords = passwords.passwords();

    if(user.password && user.passwordConfirm){      
        // check password is not too simple.
        if(easy_passwords.indexOf(user.password)!= -1 || user.password.length <= 5){
            errors.push({message: 'The password you\'ve selected is to simple.', type:'password'});
            return res.status(400).send({
                data:errors,
                message:null
            });
        }

        // Check that password and confirmation password are equal
        if(user.password !== user.passwordConfirm) {
            errors.push({message : 'Password and confirmation password are not the same.', type:'password'});
            return res.status(400).send({
                data:errors,
                message:null
            });
        }

        // Hash user's password and replace with given one
        try {
            user.password = this.hashPassword(user.password);
        } catch(err) {
            errors.push({message:'Password field must be set.',type:'password'});
            return res.status(400).send({
                data:errors,
                message:null
            });
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
                return res.status(400).send({
                    data:errors,
                    message:null
                });
            }   
        });
    }
  
    if(user.user_name){
        Users.getUserByUserName(user.user_name, function(no_user,user_exists){
            if(user_exists){
                errors.push({message:'This username already exists.', type:'user_name'});
                return res.status(400).send({
                    data:errors,
                    message:null
                });
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
            return res.send({
                data:newUser,
                message:'User Updated'
            });
        });
    }).then(function (u) {
        // return user information
        if(u.data){
            return res.status(400).send({
                data:u.data.messages,
                message:'Update failed'
            });
        }
        else{
            return Users.getUserInformation(u[0], function(err, finalUser) {
                if(err){
                    return res.status(400).send({
                        data:err,
                        message:'Update failed'
                    });
                }
                else{
                    return res.send({
                        data:finalUser,
                        message:'Update successful'
                    });
                }
            });
        }
    }).catch(function (error) {
        return res.status(400).send({
            data:error,
            message:'Update failed'
        });
    });
};

// route to authenticate a user (POST http://localhost:8080/api/authenticate)
exports.login = function (req, res) {

    // find the user
    model.users.find({
        where: {
            user_name: req.body.user_name
        }
    }).then(function (data) {
        if(data == null){
            return res.status(401).send({
                field:'user_name',
                message: 'User does not exist'
            });
        }
        else{
            var comparePassword = bcrypt.compareSync(req.body.password, data.dataValues.password);
            if (comparePassword) {
                var token = jwt.sign(data.dataValues, config.secret, {
                    expiresIn: 1440*60 // expires in 24 hours
                });

                // return the information including token as JSON
                return res.send({
                    message: 'Enjoy your token!',
                    token: token
                });
            } else {
                return res.status(401).send({
                    field:'password',
                    message: 'Invalid Password'
                });
            }

        }
       
    });
};

exports.get = function(req, res) {
    var user_name = req.params.user_name;
    var email_address = req.params.email_address;

    selectQuery = " SELECT ";
    selectQuery +=" u.id as `id`,"
    selectQuery +=" u.user_name as `user_name`,";
    selectQuery +=" u.email_address as `user_email`,";
    selectQuery +=" u.first_name as `first_name`,";
    selectQuery +=" u.last_name as `last_name`,";
    selectQuery +=" u.is_admin as `is_admin`" ;
    selectQuery +=" FROM users u";
    selectQuery +=" WHERE 1=1";

    if(user_name != undefined){
        selectQuery +=" AND u.user_name ='"+user_name+"'";        
    }
    if(email_address != undefined){
        selectQuery +=" AND u.email_address ='"+email_address+"'";
    }
    if(req.decoded.id){
        selectQuery +=" AND u.id ='"+req.decoded.id+"'";
    }

    sequelize.query( selectQuery, {type: Sequelize.QueryTypes.select}).then(function(results){
        return res.send({
            message: 'Successfully retrieved user information',
            data: results[0]
        });
    }, function(err){
        return res.status(400).send({
            message: 'Error retrieving user information',
            data: err
        });
    });
};

exports.remove = function (req, res) {

   return res.send({
        error: false,
        message: 'controller not created'
    });
    
};

// route to authenticate a user (POST http://localhost:8080/api/authenticate)
exports.getAll = function (req, res, next) {

    // find the user
    model.users.findAll().then(function (data) {
        // return the information including token as JSON
        res.send(data);
        return next();
    });
};

// route to authenticate a user (POST http://localhost:8080/api/authenticate)
// exports.get = function (req, res) {
//     let data = {}
//     if(req.body.user_name){ data.user_name = req.body.user_name }
//     if(req.body.email_address){ data.email_address = req.body.email_address }
//     if(req.decoded.id){ data.id = req.decoded.id }

//     // find the user
//     model.users.findAll({
//         where: data
//     }).then(function (data) {
//         // return the information including token as JSON
//         return res.send(data);
//     });
// };

exports.logout = function (req, res) {
    return res.send({
        error: false,
        message: 'controller not created'
    });
};

// PRIVATE FUNCTIONS
Users = {}
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

hashPassword = function(potato){
    var salt = bcrypt.genSaltSync(10);
    var breakfast = bcrypt.hashSync(potato,salt);
    //salt + hash =  return breakfast
    return breakfast;
}

verifyPassword = function(rawPassword, user){
    // user is what the database returns when ``user = model.users.find(id).then(function(user){ return user }) is called``
    brcypt.compareSync(rawPassword,user.get('password'));
}
