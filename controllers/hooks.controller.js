var env                 = process.env.NODE_ENV || "development";
var config              = require('../config/config.json')[env];
var JiraC               = require('../services').jira;
var model               = require('../modelsV2');
var db                  = require('../db');
var web_socks           = require('../websockets');
var winston             = require('winston');

var Sequelize           = db.Sequelize;
var sequelize           = db.sequelize;

exports.jiraTrigger = function( req, res ) {
  // jira webhooks should trigger ws update.
  HOOKS.getUser(req.params.hash, function(err, user){
    if(err){
      console.log('error in db query');
    }
    else{
      console.log(res);
      web_socks.tasks.taskListUpdate(req.wss, user.id, 'update task');
    }
  })

}

HOOKS = {};
HOOKS.getUser = function ( hash, callback ) {
  selectQuery = " SELECT "
  selectQuery +=" u.id as `id`,"
  selectQuery +=" u.user_name as `user_name`,"
  selectQuery +=" u.email_address as `user_email`,"
  selectQuery +=" u.first_name as `first_name`,"
  selectQuery +=" u.last_name as `last_name`,"
  selectQuery +=" u.is_admin as `is_admin`" 
  selectQuery +=" FROM users u"
  selectQuery +=" JOIN hooks as h ON u.id = h.account_id "
  selectQuery +=" WHERE h.hash ='"+hash+"'";

  sequelize.query( selectQuery, {type: Sequelize.QueryTypes.select}).then(function(results){
      callback(null, results[0][0]);
  }, function( err ){
      callback(err, null)
  });
}
