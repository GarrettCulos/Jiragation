var env                 = process.env.NODE_ENV || "development";
var config              = require('../config/config.json')[env];
var JiraC               = require('../services').jira;
var model               = require('../modelsV2');
var db                  = require('../db');
var uuidv4              = require('uuid/v4');

var cryptoJS            = require('crypto-js');
var winston             = require('winston');
var jwt                 = require('jsonwebtoken');
var bcrypt              = require('bcryptjs');

var Sequelize           = db.Sequelize;
var sequelize           = db.sequelize;

// POST: /api/v1/accounts
exports.get = function( req, res ){
  
  var account_id = req.params.id || req.body.account_id
  var queryString = "SELECT ";
    queryString += " ja.id as account_id , ";
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
    return res.send({
      message:'get accounts api sucess',
      data: results
    });
  }).catch(function(err){
    return res.status(400).send({
      message:"query failed",
      data: err
    })
    
  });
  
}

exports.add = function( req, res ){
  var account = req.body;
  var errors = [];
  var warnings = [];
  
  // encrypt user:pass as base64 then encrypt
  account.basic_auth = cryptoJS.AES.encrypt(new Buffer( account.user_name + ':' + account.password ).toString('base64'), config.secret).toString();
  
  // test that username and password are valid
  JiraC.checkAuthentication(account, function(result){
    if(result.total === 'undefined') {
      errors.push({message:'Authentication Failed',type:'general'});
      return res.status(400).send({
        message:'unable to access account', 
        data:errors
      });
    }

    return sequelize.transaction().then(function(t) {

      return model.jira_accounts.findOrCreate({
        where: {
          user_name:  account.user_name,
          url:        account.url,
          user_id:    req.decoded.id      
        },
        defaults: {
          protocal:       account.protocal,
          user_name:      account.user_name,
          url:            account.url,
          basic_auth:     account.basic_auth,
          account_email:  account.account_email,
          user_id:        req.decoded.id
        },
        transaction: t
      }).then(function(newAccount) {

        return Account.resetAccountHooks({account_id: newAccount[0].dataValues.id, transaction:t}).then(function(hookRes){
          t.commit(newAccount);
          return newAccount;
        }, function(err){
          return t.rollback();
        });

      }).catch(function (err) { 
        return t.rollback();
      });

    }).then(function (u) {
      u[0].dataValues.account_id = u[0].dataValues.id;
      return res.send({message:'Account added', data:u[0]});

    }).catch(function (error) {
      
      errors.push(error);
      return res.status(400).send({message:'Error adding account', data:errors});

    });

  }, function(error){

    errors.push({message:'Authentication Failed',type:'general'});
    return res.status(400).send({message:'Error adding account', data:errors});

  });

}

exports.resetHooks = function ( req, res ){
  var account_id = req.params.id

  return sequelize.transaction().then(function(t) {
    
    // remove jira webhook from server
    return Account.resetAccountHooks({account_id: account_id, transaction:t}).then(function(hookRes){
      t.commit(hookRes);
      return hookRes;
    }, function(err){
      t.rollback(err);
      throw err;
    });
  
  }).then(function (hook) {
    return res.send({message:'webhook created', data:hook});;

  }).catch(function (error) {
    return res.status(400).send({message:'Error resting jira webhooks', data:error});
  });

}

exports.update = function ( req, res ){

  var account = req.body;
  var errors = [];
  var warnings = [];
  // encrypt user:pass as base64 then encrypt
  account.basic_auth = cryptoJS.AES.encrypt(new Buffer( account.user_name + ':' + account.password ).toString('base64'), config.secret).toString();
  
  // test that username and password are valid
  JiraC.checkAuthentication(account, function(result){
    if(result.total === 'undefined') {
      errors.push({message:'Authentication Failed',type:'general'});
      return res.status(400).send({
        message:'unable to access account', 
        data:errors
      });
    }

    return sequelize.transaction().then(function(t) {

      return model.jira_accounts.update({
        protocal:       account.protocal,
        user_name:      account.user_name,
        url:            account.url,
        basic_auth:     account.basic_auth,
        account_email:  account.account_email,
      },{
        where: {
          id:         account.account_id,
          user_id:    req.decoded.id      
        },
        transaction: t
      }).then(function(results) {

        return model.jira_accounts.findById(
          account.account_id,
          {
            transaction:t
          }).then(function(jiraaccounts){

          return Account.resetAccountHooks({account_id: account.account_id, transaction:t}).then(function(hookRes){
            t.commit(jiraaccounts);
            return jiraaccounts;
          }, function(err){
            t.rollback(err);
            throw err;
          });

        }).catch(function (err){
          t.rollback(err);
          throw err;
        });

      }).catch(function (err){
        t.rollback(err);
        throw err;
      });

    }).then(function (u) {
      u.dataValues.account_id = u.dataValues.id;
      return res.send({message:'Account updated', data:u.dataValues});
    }).catch(function (error) {
      errors.push(error);
      return res.status(400).send({message:'Error updating account', data:errors});
    });

  }, function(error){
    errors.push({message:'Authentication Failed',type:'general'});
    return res.status(400).send({message:'Error updating account', data:errors});
  });

}

exports.remove = function( req, res ){

  var account_id = req.params.id;
  return sequelize.transaction().then(function (t) {
    return model.jira_accounts.destroy({
      where: {
        id:account_id,
        user_id: req.decoded.id         
      },
      transaction:t
    }).then(function (results) {

      return model.hooks.destroy({
        where: {
          account_id:account_id,
          hook_type:'jira'
        },
        transaction:t
      }).then(function (removed) {
        t.commit(results);
        return results;
      }).catch(function (err) {
        t.rollback(err);
        throw err;
      });

    }).catch(function (err) {
      t.rollback(err);
      throw err;
    })

  }).then(function (results) {

    if(results>0){
      return res.send({ message:"Account Removed" });
    };
    return res.status(400).send({ message:"Account dosnt exist" });

  }).catch(function (error) {
    
    return res.status(400).send({ message:"Error removing account", data:error });

  });

}

exports.get_projects = function( req, res ){
  
  return res.send({
    error:false,
    message:"not created"
  });
  
}

Account = {}
Account.resetAccountHooks = function(options) {
    var account_id = options.account_id;
    var t = options.transaction;
    return new Promise( function(resolve, reject) {

      model.hooks.destroy({
        where: {
          account_id:account_id,
          hook_type:'jira'
        },
        transaction:t
      }).then(function(removed){
      
        model.jira_accounts.findById( account_id , { transaction:t }).then(function(account){
        
          var webhook_guid = uuidv4()
          JiraC.initJiraHook({guid:webhook_guid, account:account.dataValues}, function(hookInfo){
            
            model.hooks.create({
              account_id:account.dataValues.id,
              hash: webhook_guid,
              hook_type:'jira',
              hook_info: JSON.stringify(hookInfo) 
            }, { 
              transaction:t 
            }).then(function(hookRes){

              return resolve(hookRes)

            }).catch(function (err) { 
              return reject(err)
            });

          }, function (err) {
            return reject(err)
          });

        }).catch(function (err) { 
          return reject(err)
        });

      }).catch(function (err) { 
        return reject(err)
      });
    
    });
    // return pro;

}
