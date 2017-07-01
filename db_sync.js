var fs 					= require('fs');
var db 					= require('./db.js');
var model				= require('./models/jiragation.js');
var Sequelize 			= db.Sequelize;
var sequelize 			= db.sequelize;

//Other way: Immediate insertion of data into database
sequelize.sync().then(function () {
	console.log('Table Created');
}, function(err) {
	console.log('An error occur while creating table', err);		
});