var env           		= process.env.NODE_ENV || "development";
var config        		= require('../config/config.json')[env];

var cryptoJS 			= require('crypto-js');

var model 				= require('./jiragation');
var users				= require('./users');
var db 					= require('../db');

var JiraC 				= require('../services');

var Sequelize 			= db.Sequelize;
var sequelize 			= db.sequelize;

var Accounts = function() {
};

Accounts.getAccountsById = function(req, callback){
	var queryString  = " SELECT ";
		queryString += " ja.user_name as user_name , ";
		queryString += " ja.url as url,";
		queryString += " ja.protocal as protocal, ";
		queryString += " ja.basic_auth as basic_auth, ";
		queryString += " ja.account_email as account_email ";
		queryString += " FROM jira_accounts ja ";
		queryString += " WHERE ja.user_id ="+req.decoded.id;
		queryString += " AND ja.id ="+req.body.account_id;
	
	sequelize.query(queryString, { type: Sequelize.QueryTypes.SELECT }).then(function(results){
		callback(results[0]);
	}).catch(function(err){
  		console.log(err);
  		throw err;
  	});
};

Accounts.getAccounts = function(req, callback) {
	// console.log(req)
	// console.log('model - accout');
	var queryString = "SELECT ";
		queryString += " ja.user_name as user_name , ";
		queryString += " ja.url as url,";
		queryString += " ja.basic_auth as basic_auth, ";
		queryString += " ja.protocal as protocal, ";
		queryString += " ja.account_email as account_email ";
		queryString += " FROM jira_accounts ja ";
		queryString += " WHERE ja.user_id ="+req.decoded.id;
	
	sequelize.query(queryString, { type: Sequelize.QueryTypes.SELECT }).then(function(results){
		// console.log(results);
		callback(results);
	}).catch(function(err){
  		console.log(err);
  		throw err;
  	});
};

Accounts.verifyUserAccount = function(req, callback) {
	var account_email = req.body;
	var queryString = "SELECT * FROM jira_accounts ";
		queryString += " WHERE account_email = '"+account_email +"'";
		queryString += " AND user_id = "+req.decoded.id;
	
	sequelize.query(queryString, { type: Sequelize.QueryTypes.SELECT }).then(function(results){
		if(results<1){
			return callback(false);
		}
		return callback(true);
	}).catch(function(err){
		console.log(err);
		throw err;
	});
};


Accounts.addAccount = function(req, callback) {
	var account = req.body;
	var errors = [];
	var warnings = [];
	
	// encrypt user:pass as base64 then encrypt
	account.basic_auth = cryptoJS.AES.encrypt(new Buffer( account.user_name + ':' + account.password ).toString('base64'), config.secret).toString();
	
	// test that username and password are valid
	JiraC.checkAuthentication(account, function(res){
		if(res.total === 'undefined') {
			errors.push({message:'Authentication Failed',type:'general'});
			return callback(errors, null);
		}

		sequelize.transaction(function (t) {
			return model.accounts.findOrCreate({
				where: {
					user_name: 	account.user_name,
					url: 		account.url,
					user_id: 	req.decoded.id		
				},
				defaults: {
					protocal:     	account.protocal,
				    user_name:     	account.user_name,
				    url:           	account.url,
				    basic_auth:     	account.basic_auth,
				    account_email: 	account.account_email,
				    user_id: 	   	req.decoded.id
				},
				transaction: t
			}).then(function(newUser) {
				return newUser;
			});
		}).then(function (u) {
			console.log(u);
	  		return callback(null, u);
	  	}).catch(function (error) {
	  		errors.push(error);
	  		console.log(errors);
			return callback(errors, null);
	  	});

	}, function(error){
		errors.push({message:'Authentication Failed',type:'general'});
		return callback(errors, null);
	});
	
};

Accounts.removeAccount = function(req, callback) {
	
	model.accounts.destroy({
		where: {
			user_name:req.query.user_name,
			url: req.query.url,
			user_id: req.decoded.id			
		}
	}).then(function (res) {
		if(res>0){
			return callback(res);
		};
		return callback({error:'Invalid Input'});
		throw 'Accounts.removeAccount: Invalid Input';
	}, function(err){
		console.log(err);
	});	
};

module.exports = Accounts;