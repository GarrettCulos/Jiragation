var env                 = process.env.NODE_ENV || "development";
var config              = require('../config/config.json')[env];
var JiraC               = require('../services').jira;
var model               = require('../modelsV2');
var db                  = require('../db');

var cryptoJS            = require('crypto-js');
var winston             = require('winston');
var jwt                 = require('jsonwebtoken');
var bcrypt              = require('bcryptjs');

var Sequelize           = db.Sequelize;
var sequelize           = db.sequelize;

// POST: /api/v1/accounts
exports.get = function( req, res, next ){
  
  var account_id = req.params.id || req.body.account_id
  var queryString = "SELECT ";
    queryString += " ja.user_name as user_name , ";
    queryString += " ja.url as url,";
    queryString += " ja.protocal as protocal, ";
    queryString += " ja.basic_auth as basic_auth, ";
    queryString += " ja.account_email as account_email ";
    queryString += " FROM jira_accounts ja ";
    queryString += " WHERE ja.user_id ="+req.decoded.id;
    if(account_id){
      queryString += " AND ja.id ="+req.body.account_id;
    }
  
  sequelize.query(queryString, { type: Sequelize.QueryTypes.SELECT }).then(function(results){
    res.send({
      message:'get accounts api sucess',
      data: results
    })
    return next();
  }).catch(function(err){
    res.status(400).send({
      message:"query failed",
      data: err
    })
    throw err;
    return next();
  });
  
}

exports.add = function( req, res ){
  var account = req.body;
  var errors = [];
  var warnings = [];
  
  // encrypt user:pass as base64 then encrypt
  account.basic_auth = cryptoJS.AES.encrypt(new Buffer( account.user_name + ':' + account.password ).toString('base64'), config.secret).toString();
  
  // test that username and password are valid
  JiraC.checkAuthentication(account, function(res){
    if(res.total === 'undefined') {
      errors.push({message:'Authentication Failed',type:'general'});
      return res.status(400).send({
        message:'unable to access account', 
        data:errors
      });
    }

    sequelize.transaction(function (t) {
      return model.accounts.findOrCreate({
        where: {
          user_name:  account.user_name,
          url:        account.url,
          user_id:    req.decoded.id      
        },
        defaults: {
          protocal:       account.protocal,
          user_name:      account.user_name,
          url:            account.url,
          basic_auth:         account.basic_auth,
          account_email:  account.account_email,
          user_id:        req.decoded.id
        },
        transaction: t
      }).then(function(newUser) {
        return newUser;
      });
    }).then(function (u) {
      return res.send({message:'Account added', data:u});
    }).catch(function (error) {
      errors.push(error);
      return res.status(400).send({message:'Error adding account', data:errors});
    });

  }, function(error){
    errors.push({message:'Authentication Failed',type:'general'});
    return res.status(400).send({message:'Error adding account', data:errors});
  });

}

exports.remove = function( req, res ){
  var account_id = req.params.id
  model.accounts.destroy({
    where: {
      id:account_id,
      user_name:req.query.user_name,
      url: req.query.url,
      user_id: req.decoded.id         
    }
  }).then(function (res) {

    if(res>0){
      return res.send({
        message:"Account Removed"
      });
    };
    return res.status(400).send({
      message:"Account dosnt exist"
    })

  }, function(err){

    throw err;
    return res.status(400).send({
      message:"Error removing account",
      data:err
    })

  }); 
}

exports.get_projects = function( req, res, next ){
  res.send({
    error:false,
    message:"not created"
  })
  return next();
}


