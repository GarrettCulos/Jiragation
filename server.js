var env     		= process.env.NODE_ENV || "development";
var config    	= require('./config/config.json')[env];
var express   	= require('express');
var uuidv4			= require('uuid/v4');
var db      		= require('./db.js');
// var auth_middle = require('./middleware/check_auth');
var bodyParser  = require('body-parser');
var Sequelize   = db.Sequelize;
var sequelize   = db.sequelize;
var app     		= express();
var auth    		= express.Router();

var WebSocket 	= require('ws');
var web_socks    = require('./websockets');
var controllers = require('./controllers');
var services  	= require('./services');
var validations = require('./validations');

var web_sock_bundles = {}

const wss = new WebSocket.Server({ port:config.wsPort });

require('./db_sync.js');

app.set('port', config.port);
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" })); // for parsing application/x-www-form-urlencoded


app.use(function(req, res, next) {
  if(req.url.indexOf('api')!= -1){
    console.log(new Date(),' REQUEST: ', req.method, req.url);
    req.wss = wss;
  }
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,HEAD,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, x-access-token, Content-Type, Accept");
  next();
});

wss.on('connection', function connection( ws, req ) {
  /**
	 * Initialize bundlize handshake
	**/
	ws.send( JSON.stringify({type:'handshake'}) );

	/**
	 * When the ws closes remove it from the bundle
	**/
	ws.on('close', function close(data) {
		console.log('ws close', data);
		// for(var i in web_sock_bundles){
		// 	if(var web_sock_bundles.hasOwnProperty())
		// }
		// var ind = web_sock_bundles[user.socket_guid].array.findIndex((function(e){ return e.ws_key === req.headers['sec-websocket-key'] }))
	  // web_sock_bundles[user.socket_guid].array.splice(ind)
	  // console.log(web_sock_bundles);
	});

	ws.on('open', function open(data) {
		console.log('ws open', data);
	})
  
  ws.on('message', function init(message) {
    var data = JSON.parse(message)
    /**
		 * Set this websocket connection to a bundle based on user socket_guid
		**/
    if(data.type == "bundle"){
      var user = data.user[0]
      if(web_sock_bundles.hasOwnProperty(user.socket_guid)){
        web_sock_bundles[user.socket_guid].array.push({ws:ws, ws_key:req.headers['sec-websocket-key']})
      }
      else{
        web_sock_bundles[user.socket_guid] = {account:user, array:[{ws:ws, ws_key:req.headers['sec-websocket-key']}]}
      }
      console.log(web_sock_bundles);
    }
		
		/**
		 * websocket trigger to update all active logs for all bundle members
		**/
		web_socks.logs.activeLogUpdate(ws, web_sock_bundles);
		
		/**
		 * websocket trigger to update filter settings for all bundle members
		**/
		web_socks.logs.taskFiltersUpdate(ws, web_sock_bundles);
		
		/**
		 * websocket trigger to update task lsit items for all bundle members
		**/
		web_socks.logs.taskListUpdate(ws, web_sock_bundles);

  });
  
});
// web_socks.gen.connectionHeartbeat(wss);

/* Routes v2 */
require('./endpoints/v2/')('/api/v2', app, controllers, auth, services, validations, web_sock_bundles)


/* Routes v1 */
// app.use('/api/v1/', require('./routes/api').api);
// app.use(auth_middle);
// app.use('/api/v1/task', require('./routes/taskManager').taskManager);
// app.use('/api/v1/account', require('./routes/accounts').accounts );
// app.use('/api/v1/jira', require('./routes/jira').jira);
// app.use('/api/v1/users', require('./routes/users').users);
// app.use('/api/v1/notes', require('./routes/notes').notes);


app.use('/', express.static(config.root + "/app"));


app.get('*', function (req, res) {
    res.sendFile(__dirname+'/app/index.html');
});

app.listen(app.get('port'), function(){
  console.log("Node app is running at localhost:" + app.get('port'));
});