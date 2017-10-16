var env     		= process.env.NODE_ENV || "development";
var config    	= require('./config/config.json')[env];
var express   	= require('express'); 
var db      		= require('./db.js');
var auth_middle = require('./middleware/check_auth');
var bodyParser  = require('body-parser');
var Sequelize   = db.Sequelize;
var sequelize   = db.sequelize;
var app     		= express();
var auth    		= express.Router();

var WebSocket 	= require('ws');
var webSocks = require('./controllers');
var controllers = require('./controllers');
var services  	= require('./services');
var validations = require('./validations');

const wss = new WebSocket.Server({ port:config.wsPort });

require('./db_sync.js');


app.set('port', config.port);
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" })); // for parsing application/x-www-form-urlencoded


app.use(function(req, res, next) {
  if(req.url.indexOf('api')!= -1){
    console.log(new Date(),' REQUEST: ', req.method, req.url);    
  }
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,HEAD,OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, x-access-token, Content-Type, Accept");
  next();
});

// Broadcast to all.
wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
  	console.log(client);
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });
});

/* Routes v2 */
require('./endpoints/v2/')('/api/v2', app, controllers, auth, services, validations, wss)


/* Routes v1 */
app.use('/api/v1/', require('./routes/api').api);
app.use(auth_middle);
app.use('/api/v1/task', require('./routes/taskManager').taskManager);
app.use('/api/v1/account', require('./routes/accounts').accounts );
app.use('/api/v1/jira', require('./routes/jira').jira);
app.use('/api/v1/users', require('./routes/users').users);
app.use('/api/v1/notes', require('./routes/notes').notes);


app.use('/', express.static(config.root + "/app"));


app.get('*', function (req, res) {
    res.sendFile(__dirname+'/app/index.html');
});

app.listen(app.get('port'), function(){
  console.log("Node app is running at localhost:" + app.get('port'));
});