var db 					= require('../init_db.js');

var Sequelize 			= db.Sequelize;

var sequelize 			= db.sequelize;

var Accounts = function() {

};

Accounts.getAccounts = function(callback) {
	// console.log('model - accout');
	var queryString = "SELECT user_name,url,password,protocal FROM jiraAccounts";
	
	sequelize.query(queryString, { type: Sequelize.QueryTypes.SELECT })
	.then(function(results){
		callback(results);
		// console.log(results);
	})
	.catch(function(err){
  		console.log(err);
  		throw err;
  	});

};

Accounts.setAccount = function(account, callback) {
	user_name 	= 	account.user_name;
	base_url 	= 	account.url;
	password 	= 	account.password;
	protocal	=	account.protocal;

	var queryString = "INSERT user_name,url,password,protocal FROM jiraAccounts";
	/* Insert account into database table */
}

module.exports = Accounts;