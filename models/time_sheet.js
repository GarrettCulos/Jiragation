var db 					= require('../init_db.js');

var Sequelize 			= db.Sequelize;

var sequelize 			= db.sequelize;

var TimeSheet = function() {

};

// Pull Time Sheet
TimeSheet.getTaskTime = function(callback) {
	// console.log('model - accout');
	var queryString = "SELECT * FROM timeSheet";
	
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
TimeSheet.logTaskTime = function(req, callback) {
	// Role.add = function(role, callback) {
	//    sequelize.transaction(function (t) {
	//         return model.Role.create(role, {transaction: t}).then(function(newRole) {
	//             if(role.permissionIds && role.permissionIds.length > 0) {
	//                     //associate permissions for newly added role
	//                     var whereClause = {where: {id: {$in: role.permissionIds}}};
	//                     return model.Permission.findAll(whereClause, {transaction: t}).then(function(perms){
	//                         return newRole.setPermissions(perms, {transaction: t}).then(function(addedPerms) {
	//                             return newRole; 
	//                         });
	//                     });
	//             }
	//             else {
	//                 return newRole;
	//             }
	//         });
	//     }).then(function (role) {
	//         return Role.findById(role.id, function(err, finalRole) {
	//             return callback(null, finalRole);
	//         });
	//     }).catch(function (error) {
	//         return callback(error, null);
	//     });

	    
	var queryString = "INSERT req.task_id, req.end_time , req.logged_time INTO timeSheet";
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

//pull time log for specific task_id
TimeSheet.getTaskTime = function(taskID, callback) {
	// console.log('model - accout');
	var queryString = "SELECT * FROM timeSheet WHERE task_id as taskID";
	
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

module.exports = TimeSheet;