var express 	= require('express'); 
var db 			= require('./init_db.js');
var Sequelize 	= db.Sequelize;
var sequelize 	= db.sequelize;
var app 		= express();

require('./create_db.js');

app.set('port', 8000);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/* Routes */
app.use('/task', require('./routes/taskManager').taskManager);
app.use('/account', require('./routes/accounts').accounts );
app.use('/pull_jiras', require('./routes/jira').jira);

app.use('/', express.static('../Jiragation/'));

app.listen(app.get('port'), function(){
  console.log("Node app is running at localhost:" + app.get('port'));
});
