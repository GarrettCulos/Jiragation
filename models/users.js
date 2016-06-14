var db 					= require('../init_db.js');

var Sequelize 			= db.Sequelize;

var sequelize 			= db.sequelize;

var users = function() {

};

// Pull Time Sheet
users.getUser = function(callback) {
	// console.log('model - accout');
	var queryString = "SELECT * FROM users WHERE id = 1";
	
	sequelize.query(queryString, { type: Sequelize.QueryTypes.SELECT })
	.then(function(results){
		// console.log(results);
		callback(results);
		
	})
	.catch(function(err){
  		console.log(err);
  		throw err;
  	});

};

// Pull time log for towards task_id
users.setUserInfo = function(user_info, callback) {
	var firstName = user_info.firstName;
	var givenName = user_info.givenName;
	var preferedName = user_info.preferedName;
	
	var queryString = "UPDATE users SET ";

	if(firstName){
		queryString += "firstName = '" + firstName+"'";
	}
	if(givenName){
		if(firstName){
			queryString += " , ";
		}
		queryString += "givenName = '" + givenName+"'";
	}
	if(preferedName){
		if(firstName || givenName){
			queryString += " , ";
		}
		queryString += "preferedName = '" + preferedName+"'";
	}

	queryString += "  WHERE id = 1;";



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


module.exports = users;