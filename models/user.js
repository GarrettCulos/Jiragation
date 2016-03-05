var db 					= require('../init_db.js');

var Sequelize 			= db.Sequelize;

var sequelize 			= db.sequelize;

var user = function() {

};

// Pull Time Sheet
user.getUser = function(callback) {
	// console.log('model - accout');
	var queryString = "SELECT * FROM user";
	
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

// Pull time log for towards task_id
user.setGivenName = function(given_name, callback) {

	var queryString = "INSERT given_name FROM user";
	/* Insert account into database table */
	sequelize.query(queryString, { type: Sequelize.QueryTypes.INSERT })
		.then(function(results){
			callback(results);
			// console.log(results);
		})
		.catch(function(err){
	  		console.log(err);
	  		throw err;
	  	});
};

user.setFirstName = function(first_name, callback) {

	var queryString = "INSERT first_name FROM user";
	/* Insert account into database table */
	sequelize.query(queryString, { type: Sequelize.QueryTypes.INSERT })
		.then(function(results){
			callback(results);
			// console.log(results);
		})
		.catch(function(err){
	  		console.log(err);
	  		throw err;
	  	});
};

module.exports = user;