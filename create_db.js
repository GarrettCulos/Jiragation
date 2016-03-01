var fs 					= require('fs');

var db 					= require('./init_db.js');

var Sequelize 			= db.Sequelize;

var sequelize 			= db.sequelize;

// var jira_account 		= require('./load_db.js')
	var file_path = './db/';
	var jira_account = [];

	fs.readdir(file_path,function(err,files){
	    if(err){ 
	    	throw err
	    } else {
		    files
		    .filter(function(file) { return file.substr(-5) === '.json'; })
			.forEach(function(file){
				// console.log(file);
				var jsonObj = JSON.parse(fs.readFileSync(file_path+file, 'utf8'))
				jira_account.push(jsonObj.data);
			});
		}
	});

//Create Item Table Structure
var jiraAccounts = sequelize.define('jiraAccounts', {
	id: {type : Sequelize.INTEGER, autoIncrement: true, primaryKey: true},
    protocal: {type: Sequelize.STRING, allowNull:false},
    user_name:{ type: Sequelize.STRING, allowNull: false},
    url: { type: Sequelize.STRING, allowNull: false},
    password: Sequelize.STRING,
});

//Other way: Immediate insertion of data into database
sequelize.sync().then(function () {
	console.log('jiraAccounts table created successfully');
		
	var i = 1;
	jira_account.forEach(function(value) {			
		jiraAccounts.create({
			id: i ,
			user_name:value['user_name'],
			url: value['host_url'],
			password: value['password'],
			protocal: value['protocal']
		}).then(function () {
			console.log('... successful table entry');
		}, function(err){
			console.log('... entry already exists')
		});	
		i = i + 1;
	});

}, function(err) {
	console.log('An error occur while creating table');		
});





