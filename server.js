var express 	= require('express'); 

require('./create_db.js');

var app 		= express();

app.set('port', 8000);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
  // console.log('Got there')
  // res.json({data: [1,2,3,4]})
});

app.get('/', function(req, res, next) {
	// Handle the get for this route
});

app.post('/', function(req, res, next) {
	// Handle the post for this route
});



app.use('/', express.static('../Jiragation/'));

app.listen(app.get('port'), function(){
  console.log("Node app is running at localhost:" + app.get('port'));
});
