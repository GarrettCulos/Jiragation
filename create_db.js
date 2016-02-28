// ------------------------//
//    CREATING DATABASES   //
// ------------------------//

var db = require('./init_db.js');

var Sequelize = db.Sequelize;

var sequelize = db.sequelize;

//Create Item Table Structure
var jiraAccounts = sequelize.define('jiraAccounts', {
	id: {type : Sequelize.INTEGER, autoIncrement: true, primaryKey: true},
    user_name:{ type: Sequelize.STRING, allowNull: false},
    url: { type: Sequelize.STRING, allowNull: false},
    password: Sequelize.STRING
});
 
//Applying Item Table to database
sequelize.sync().then(function (){	
	}, function(err){

	}); 

 
//Other way: Immediate insertion of data into database
sequelize.sync().then(function () {
	console.log('jiraAccounts table created successfully');
	jiraAccounts.create({
		id: 1,
		user_name:'gculos',
		url: 'http://jira.highwaythreesolutions.com/',
		password: 'gummyworms'
		}).then(function () {
			console.log('... successful table entry');
		}, function(err){
			console.log('(entry already exists)')
		});	
	}, function(err) {
		console.log('An error occur while creating table');		
	});



