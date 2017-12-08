var env         = process.env.NODE_ENV || "development";
var config      = require('./config/config.json')[env];
var express     = require('express');
var cron        = require('cron');
var cs          = require('./cron/jobsService');
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
var polling     = {};

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
   * Initialize bundle handshake
   *
  **/
  ws.send( JSON.stringify({type:'handshake'}) );

  ws.on('close', function close(data) { 
    
    if( ws['ws-bundle-id'] !== undefined ) {
    
      polling[ws['ws-bundle-id']].ws_watchers += -1 || 0;
      if(polling[ws['ws-bundle-id']].ws_watchers === 0){
        polling[ws['ws-bundle-id']] = undefined;
      }
    
    }

  });

  ws.on('open', function open(data) { console.log('ws open', data); })
  
  ws.on('message', function init(message) {

    var data = JSON.parse(message)
  
    web_socks.gen.connectLog(ws, req, data.type)
    
    /**
     *
     * Set this websocket connection to a bundle based on user id
     *
    **/
    if(data.type == "bundle"){
      // alternative to bundles, set bundle_id and call forEach client and trigger bundle_id matchings
      ws['ws-bundle-id'] = data.user[0].id;


      /**
       *
       * Set a fake api request object to use when calling controller methods
       *
      **/
      var apiRequestSpoof = {decoded:data.user[0]}
      /**
       *
       * Send active tasks when bundling handshake is initiated
       *
      **/
      controllers.task.get_active_tasks( apiRequestSpoof, {send:function(re){
        ws.send(JSON.stringify({type:'updateActiveTask', data:re.data}))
      }});

      /**
       *
       * Send current filters tasks when bundling handshake is initiated
       *
      **/
      // controllers.task.get_task_filters( apiRequestSpoof, {send:function(re){
      //   ws.send(JSON.stringify({type:'updateActiveTask', data:re.data}))
      // }});


      /**
       *
       * Initialize bundle-cron (polling services); polling object of user id's with polling time data.
       *
      **/
      if(polling[data.user[0].id] === undefined) {

        polling[data.user[0].id] = {};
        cs.init(data.user[0].id).then( function(accountCrons) {

          polling[data.user[0].id].ws_watchers = 1;
          polling[data.user[0].id].accounts = accountCrons.map( function(account) {
            
            account.last_cronned = new Date();
            account.job = new cron.CronJob({
                cronTime: '0 */1 * * * *',
                onTick: function() {

                  services.jira.getUpdatedTasks(account, function(re) {
                    var d = JSON.parse(re)
                    account.last_cronned = new Date();
                    if(d.issues.length > 0){
                      controllers.notifications.bulk_import( {notifications:d.issues, account_id:account.id, user_id:data.user[0].id}, {send:function(re){
                        web_socks.tasks.updatedTasks(wss, data.user[0].id, re);
                      }});
                    }
                    
                  }, function(error) {
                    console.error(error);
                  });
                  
                },
                start: true,
              });

            return account;

          });

        });

      } else {
        // increment watchers count
        polling[data.user[0].id].ws_watchers += 1;
      } 


    }
    
    /**
     *
     * websocket trigger to update all active logs for all bundle members
     *
    **/
    if(data.type == "activeTaskChange"){
      
      /**
       *
       * Set a fake api request object to use when calling controller methods
       *
      **/
      controllers.task.get_active_tasks( {decoded:{id:ws['ws-bundle-id']}}, {send:function(re){
        web_socks.tasks.activeTaskChange(wss, ws['ws-bundle-id'], ws._socket._peername.address+ws._socket._peername.port, re.data);
      }});
    }
    
    /**
     *
     * websocket trigger to update filter settings for all bundle members
     *
    **/
    if(data.type == "taskFiltersUpdate"){
      web_socks.tasks.taskFiltersUpdate(wss, ws['ws-bundle-id'], ws._socket._peername.address+ws._socket._peername.port, data.data);
    }
    
    /**
     *
     * websocket trigger to update task list items for all bundle members
     *
    **/
    if(data.type == "taskListUpdate"){
      web_socks.tasks.taskListUpdate(wss, ws['ws-bundle-id'], data.data);
    }

  });
  
});

/* Routes v2 */
require('./endpoints/v2/')('/api/v2', app, controllers, auth, services, validations, wss)

app.use('/', express.static(config.root + "/app"));

app.get('*', function (req, res) {
    res.sendFile(__dirname+'/app/index.html');
});

app.listen(app.get('port'), function(){
  console.log("Node app is running at localhost:" + app.get('port'));
});