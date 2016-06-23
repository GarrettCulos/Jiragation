var db 					= require('../init_db');
var model 				= require('./jiragation');
var Sequelize 			= db.Sequelize;
var sequelize 			= db.sequelize;

var Accounts = function() {

};

Accounts.getAccounts = function(callback) {
	// console.log('model - accout');
	var queryString = "SELECT user_name,url,password,protocal FROM jira_accounts";
	
	sequelize.query(queryString, { type: Sequelize.QueryTypes.SELECT })
	.then(function(results){
		callback(results);
	})
	.catch(function(err){
  		console.log(err);
  		throw err;
  	});
};

// NEEDS TESTING
Accounts.setAccount = function(account, callback) {
	model.JiraAccounts.update(account, {
		where: {
			user_name:account.user_name,
			url: account.url		
		}
	})
	.then(function (rows) {
		if(rows < 1){
			model.JiraAccounts.create({
				user_name:account.user_name,
				url: account.url,
				password: account.password,
				protocal: account.protocal
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

Accounts.removeAccount = function(account, callback) {
	model.JiraAccounts.destroy({
		where: {
			user_name:account.user_name,
			url: account.url		
		}
	})
	.then(function (rows) {
		callback(null,table);
	}, function(err){
		console.log(err);
	});	
};



module.exports = Accounts;