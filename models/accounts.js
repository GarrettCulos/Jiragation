var db 					= require('../init_db');
var model 				= require('./jiragation');
var Sequelize 			= db.Sequelize;
var sequelize 			= db.sequelize;

var Accounts = function() {

};

Accounts.getAccounts = function(req, callback) {
	// console.log('model - accout');
	var queryString = "SELECT ";
			queryString += " ja.user_name as user_name , ";
			queryString += " ja.url as url,";
			queryString += " ja.password as password, ";
			queryString += " ja.protocal as protocal, ";
			queryString += " ja.account_email as account_email ";
			queryString += " FROM jira_accounts ja ";
			queryString += " ja.user_id ="+req.decoded.id;
	
	sequelize.query(queryString, { type: Sequelize.QueryTypes.SELECT })
	.then(function(results){
		callback(results);
	})
	.catch(function(err){
  		console.log(err);
  		throw err;
  	});
};

Accounts.verifyUserAccount = function(req, callback) {
	var account_email = req.body;
	var queryString = "SELECT * FROM jira_accounts ";
			queryString += " WHERE account_email = '"+account_email +"'";
			queryString += " AND user_id = "+req.decoded.id;
	
	sequelize.query(queryString, { type: Sequelize.QueryTypes.SELECT })
	.then(function(results){
		console.log(results);
		if(results<1){
			return callback(false);
		}
		return callback(true);

	})
	.catch(function(err){
		console.log(err);
		throw err;
	});
};

// NEEDS TESTING
Accounts.setAccount = function(req, callback) {
	var account = req.body;

	model.JiraAccounts.update(account, {
		where: {
			user_name:account.user_name,
			url: account.url,
			user_id: req.decoded.id		
		},
	})
	.then(function (rows) {
		if(rows < 1){
			model.JiraAccounts.create({
				user_name:account.user_name,
				url: account.url,
				account_email: account.account_email,
				password: account.password,
				protocal: account.protocal,
				user_id: req.decoded.id	
			}).then(function(table){
				callback(null,table);
			});
		} else{
			callback(null,rows);			
		}

	}, function(err){
		console.log(err);
	});	
};

Accounts.removeAccount = function(req, callback) {
	var account = req.body
	model.JiraAccounts.destroy({
		where: {
			user_name:account.user_name,
			url: account.url,
			user_id: req.decoded.id			
		}
	})
	.then(function (rows) {
		callback(null,table);
	}, function(err){
		console.log(err);
	});	
};



module.exports = Accounts;