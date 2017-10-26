var env         = process.env.NODE_ENV || "development";
var config      = require('./config/config.json')[env];
var express     = require('express');
var uuidv4      = require('uuid/v4');
var db          = require('./db.js');
var bodyParser  = require('body-parser');
var Sequelize   = db.Sequelize;
var sequelize   = db.sequelize;
var app         = express();
var auth        = express.Router();

var WebSocket   = require('ws');
var web_socks   = require('./websockets');
var controllers = require('./controllers');
var services    = require('./services');
var validations = require('./validations');

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
   *
   * Websocket Information
   * - active tasks
   * - task filters
   * 
  **/

  /**
   * Initialize bundlize handshake
  **/
  ws.send( JSON.stringify({type:'handshake'}) );

  /**
   * When the ws closes remove it from the bundle (done by default)
  **/
  ws.on('close', function close(data) {
    console.log('ws close', data);
  });

  ws.on('open', function open(data) {
    console.log(data);
    //res =  controllers.tasks.get_active_tasks( data, res)

    console.log('ws open', data);
  })
  
  ws.on('message', function init(message) {

    var data = JSON.parse(message)
  
    web_socks.gen.connectLog(ws, req, data.type)
    
    /**
     * Set this websocket connection to a bundle based on user id
    **/
    if(data.type == "bundle"){
      // alternative to bundles, set bundle_id and call forEach client and trigger bundle_id matchings
      ws['ws-bundle-id'] = data.user[0].id;
    }
    
    /**
     * websocket trigger to update all active logs for all bundle members
    **/
    if(data.type == "activeTaskChange"){
      console.log(ws._socket._peername);
      web_socks.tasks.activeTaskChange(wss, ws['ws-bundle-id'], ws._socket._peername.port, data.data);
    }
    
    /**
     * websocket trigger to update filter settings for all bundle members
    **/
    if(data.type == "taskFiltersUpdate"){
      web_socks.tasks.taskFiltersUpdate(wss, ws['ws-bundle-id'], ws._socket._peername.port, data.data);
    }
    
    /**
     * websocket trigger to update task lsit items for all bundle members
    **/
    if(data.type == "taskListUpdate"){
      web_socks.tasks.taskListUpdate(wss, ws['ws-bundle-id'], data.data);
    }

  });
  
});

/* Routes v2 */
require('./endpoints/v2/')('/api/v2', app, controllers, auth, services, validations)

app.use('/', express.static(config.root + "/app"));

app.get('*', function (req, res) {
    res.sendFile(__dirname+'/app/index.html');
});

app.listen(app.get('port'), function(){
  console.log("Node app is running at localhost:" + app.get('port'));
});