var express 	= require('express'); 
var db 			= require('./init_db.js');
var Sequelize 	= db.Sequelize;
var sequelize 	= db.sequelize;
var app 		= express();

require('./create_db.js');

app.set('port', 8000);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/routing/fetch_accounts', function(req, res, next) { 
 	// var accounts = {};
	
	sequelize.query("SELECT user_name,url,password FROM jiraAccounts", { type: Sequelize.QueryTypes.SELECT })
	.then(function(jiraAccounts){
		// res.json(jiraAccounts);
		// console.log(jiraAccounts+ 'got there'); //for testing
		res.send(jiraAccounts);
	});
});

app.post('/', function(req, res, next) {
	// Handle the post for this route
});



app.use('/', express.static('../Jiragation/'));

app.listen(app.get('port'), function(){
  console.log("Node app is running at localhost:" + app.get('port'));
});
