var env           = process.env.NODE_ENV || "development";
var config        = require('../config/config.json')[env];
var cryptoJS      = require('crypto-js')
var async         = require('async');
var model         = require('../modelsV2');
var request       = require('request');
var Cron          = require('cron').CronJob;
var services      = require('../services');

const min_polling_time = 5; //min
const max_polling_time = 60; //min

var cron = {}


init = function(user_id) {

  return model.jira_accounts.findAll({
    where: {
      user_id: user_id
    }
  }).then( function(results) {

    var ppa = [];
    results.map( function(account) {

      var pp = new Promise( function(resolve, reject) {
        
        services.jira.self(account, function(response) {
          account.dataValues.self = JSON.parse(response);
          resolve(account.dataValues);
        }, function(error){
          reject(error);
        });

      });

      ppa.push(pp);

    });

    return Promise.all(ppa).then(function(res){
      return Promise.resolve(res);
    });

  }, function(err) {

    return Promise.reject(err);

  });
}


cron.init = init;
module.exports = cron;