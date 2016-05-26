var fs 					= require('fs');
var db 					= require('./init_db.js');
var model				= require('./models/jiragation.js');
var Sequelize 			= db.Sequelize;
var sequelize 			= db.sequelize;

var file_path = './db/';
var jira_account = [];

// fs.readdir(file_path,function(err,files){
//     if(err){ 
//     	throw err
//     } else {
// 	    files
// 	    .filter(function(file) { return file.substr(-5) === '.json'; })
// 		.forEach(function(file){
// 			// console.log(file);
// 			var jsonObj = JSON.parse(fs.readFileSync(file_path+file, 'utf8'))
// 			jira_account.push(jsonObj.data);
// 		});
// 	}
// });

// //Other way: Immediate insertion of data into database
// sequelize.sync().then(function () {
// 	var i = 1;
// 	jira_account.forEach(function(account) {

// 		model.JiraAccounts.create({
// 			id: i ,
// 			user_name:account['user_name'],
// 			url: account['host_url'],
// 			password: account['password'],
// 			protocal: account['protocal']
// 		}).then(function () {
// 			// console.log('... successful table entry');
// 		}, function(err){
// 			console.log(err);
// 		});	
// 		i = i + 1;
// 	});

// }, function(err) {
// 	console.log('An error occur while creating table');		
// });