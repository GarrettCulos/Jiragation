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
  
 
    return res.status(400).send({
      message:"query failed",
      data: err
    })
 
  
}

exports.add = function( req, res ){
  
  return res.status(400).send({
    message:'unable to access account', 
    data:errors
  });
  
  // // encrypt user:pass as base64 then encrypt
  // account.basic_auth = cryptoJS.AES.encrypt(new Buffer( account.user_name + ':' + account.password ).toString('base64'), config.secret).toString();
  
  // // test that username and password are valid
  // JiraC.checkAuthentication(account, function(result){
  //   if(result.total === 'undefined') {
  //     errors.push({message:'Authentication Failed',type:'general'});
  //     return res.status(400).send({
  //       message:'unable to access account', 
  //       data:errors
  //     });
  //   }

  //   return sequelize.transaction().then(function(t) {

  //     return model.jira_accounts.findOrCreate({
  //       where: {
  //         user_name:  account.user_name,
  //         url:        account.url,
  //         user_id:    req.decoded.id      
  //       },
  //       defaults: {
  //         protocal:       account.protocal,
  //         user_name:      account.user_name,
  //         url:            account.url,
  //         basic_auth:     account.basic_auth,
  //         account_email:  account.account_email,
  //         user_id:        req.decoded.id
  //       },
  //       transaction: t
  //     }).then(function(newAccount) {

  //       return Account.resetAccountHooks({account_id: newAccount[0].dataValues.id, transaction:t}).then(function(hookRes){
  //         t.commit(newAccount);
  //         return newAccount;
  //       }, function(err){
  //         return t.rollback();
  //       });

  //     }).catch(function (err) { 
  //       return t.rollback();
  //     });

  //   }).then(function (u) {
  //     u[0].dataValues.account_id = u[0].dataValues.id;
  //     return res.send({message:'Account added', data:u[0]});

  //   }).catch(function (error) {
      
  //     errors.push(error);
  //     return res.status(400).send({message:'Error adding account', data:errors});

  //   });

  // }, function(error){

  //   errors.push({message:'Authentication Failed',type:'general'});
  //   return res.status(400).send({message:'Error adding account', data:errors});

  // });

}


exports.update = function ( req, res ){

  

}

exports.remove = function( req, res ){
  // expire do not remove
  // var account_id = req.params.id;
  // return sequelize.transaction().then(function (t) {
  //   return model.jira_accounts.destroy({
  //     where: {
  //       id:account_id,
  //       user_id: req.decoded.id         
  //     },
  //     transaction:t
  //   }).then(function (results) {

  //     return model.hooks.destroy({
  //       where: {
  //         account_id:account_id,
  //         hook_type:'jira'
  //       },
  //       transaction:t
  //     }).then(function (removed) {
  //       t.commit(results);
  //       return results;
  //     }).catch(function (err) {
  //       t.rollback(err);
  //       throw err;
  //     });

  //   }).catch(function (err) {
  //     t.rollback(err);
  //     throw err;
  //   })

  // }).then(function (results) {

  //   if(results>0){
  //     return res.send({ message:"Account Removed" });
  //   };
  //   return res.status(400).send({ message:"Account dosnt exist" });

  // }).catch(function (error) {
    
  //   return res.status(400).send({ message:"Error removing account", data:error });

  // });

}