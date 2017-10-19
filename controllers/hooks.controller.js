var env                 = process.env.NODE_ENV || "development";
var config              = require('../config/config.json')[env];
var JiraC               = require('../services').jira;
var model               = require('../modelsV2');
var db                  = require('../db');

var winston             = require('winston');

var Sequelize           = db.Sequelize;
var sequelize           = db.sequelize;

exports.jiraTrigger = function( req, res ){
  // jira webhooks should trigger ws update. 

  
}

