var db 					= require('../init_db');

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
		// console.log(results);
	})
	.catch(function(err){
  		console.log(err);
  		throw err;
  	});

};

Accounts.setAccount = function(account, callback) {
	JiraAccounts.create({
		user_name:account.user_name,
		url: account.url,
		password: account.password,
		protocal: account.protocal
	}).then(function () {
		console.log('... Successfully added account');
	}, function(err){
		console.log('... Error adding account')
	});	
}

module.exports = Accounts;