var env           = process.env.NODE_ENV || "development";
var config        = require('../config/config.json')[env];
var cryptoJS      = require('crypto-js')
var async         = require('async');
var winston       = require('winston');
var model         = require('../modelsV2');
var Promise       = require('promise')
const http        = require('http');
const https       = require('https');

function checkJson(text){
  if (/^[\],:{}\s]*$/.test(text.replace(/\\["\\\/bfnrtu]/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
    return true
  }else{
    return false
  }
}

exports.getTasks = function(user_id, callback, callbackError) {
  model.jira_accounts.findAll({
    where: {
      user_id: user_id
    }
  }).then(function (results) {
    
    let Tasks = [];

    results.map((account)=>{
      var pp = new Promise(function (resolve, reject) {
        var basic_authBytes  = cryptoJS.AES.decrypt(account.basic_auth.toString(), config.secret);
        var basic_auth = basic_authBytes.toString(cryptoJS.enc.Utf8);
        var options = {
          rejectUnauthorized: true,
          method: 'GET',
          host: account.url,
          path: '/rest/api/latest/search?jql=assignee='+ account.user_name + '+order+by+duedate&maxResults=1000',
          headers:{
            'Content-Type':  'application/json',
            'Authorization': 'Basic '+ basic_auth
          }
        };
        var requestData = {};
        requestData.account = account;
        
        jiraRequest(options, requestData, function(response){
          response = JSON.parse(response);
          response.account = account;
          // console.log(response);
          resolve(JSON.stringify(response));
        }, function(error){
          console.error(error);
          reject(error);
        });
      });
      Tasks.push(pp);
    });

    Promise.all(Tasks).then(function(resp){
      callback(resp);
    }, function(error){
      callbackError(error);
    });

  }, function(err){
    console.log(err);
  });
  
}

exports.getTaskComments = function(task_key, account_id, callback, errorCallback) {
  // console.log(task_key, account_id);
  model.jira_accounts.findAll({
    where: { id: account_id }
  }).then(function(results) {
    // console.log(results[0].dataValues);
    let account           = results[0].dataValues;
    var basic_authBytes   = cryptoJS.AES.decrypt(account.basic_auth.toString(), config.secret);
    var basic_auth        = basic_authBytes.toString(cryptoJS.enc.Utf8);
    var options           = {
                              rejectUnauthorized: true,
                              method: 'GET',
                              host: account.url,
                              path: '/rest/api/2/issue/'+task_key+'/comment',
                              headers:{
                                'Content-Type':  'application/json',
                                'Authorization': 'Basic '+ basic_auth
                              }
                            };

    var requestData = {};
    requestData.account = account;

    jiraRequest(options, requestData, function(response){
      // console.log(response);
      callback(response)
    }, function(error){
      // console.log('error getting accout',error)
      errorCallback(error);
    });
  });
};

exports.addTaskComments = function(task_key, account_id, data, callback, errorCallback) {
  // console.log(task_key, account_id, data);
  model.jira_accounts.findAll({
    where: { id: account_id }
  }).then(function(results) {
    let account           = results[0].dataValues;
    var basic_authBytes   = cryptoJS.AES.decrypt(account.basic_auth.toString(), config.secret);
    var basic_auth        = basic_authBytes.toString(cryptoJS.enc.Utf8);
    var options           = {
                              rejectUnauthorized: true,
                              method: 'POST',
                              host: account.url,
                              path: '/rest/api/2/issue/'+task_key+'/comment',
                              headers:{
                                'Content-Type':  'application/json',
                                'Authorization': 'Basic '+ basic_auth
                              }
                            };

    var requestData = {};
    requestData.account = account;

    jiraRequest(options, requestData, function(response){
      // console.log(response);
      callback(response)
    }, function(error){
      errorCallback(error);
    });
  });
};

exports.checkAuthentication = function(account, callback, errorCallback) {
  var basic_authBytes  = cryptoJS.AES.decrypt(account.basic_auth.toString(), config.secret);
  var basic_auth = basic_authBytes.toString(cryptoJS.enc.Utf8);
  var options = {
    rejectUnauthorized: true,
    method: 'GET',
    host: account.url,
    path: '/rest/api/latest/search?jql=assignee='+ account.user_name + '+order+by+duedate',
    headers:{
      'Content-Type':  'application/json',
      'Authorization': 'Basic '+ basic_auth
    }
  };
  
  var requestData = {};
  requestData.account = account;
  
    jiraRequest(options, requestData, function(response){
      if(response.errorMessages || resonse.errors){
        return errorCallback(response);
      }
      callback(response)
    }, function(error){
      // console.log('error getting accout',error)
      errorCallback(error);
    });
};

exports.jiraRequest = function(options, dataRequest, callback, errorCallback){
  jiraRequest(options, dataRequest, function(res){
    callback(res)
  }, function(res){
    errorCallback(res)
  }); 
}

jiraRequest = function(options, dataRequest, callback, errorCallback){
  var data ='';
  if(dataRequest.account.protocal === "http"){

    var post_req = http.request(options, function(response) {
      response.setEncoding('utf8')
      response.on('data', function(d) {
        data += d
      });
      response.on('end', function(d) {
        if(checkJson(data) && data != null && data != undefined && data.length>0){
          callback(data);
        }
        else{
          errorCallback(data);
        }
      });
    }).on('error', (error) => {
      errorCallback(error); 
    });

  } else {

    var post_req = https.request(options, function(response) {  
      response.setEncoding('utf8')
      response.on('data', function(d) {
        data += d
      });
      response.on('end', function(d) {
        if(checkJson(data) && data != null && data != undefined && data.length>0){
          callback(data);
        }
        else{
          errorCallback(data);
        }
      });
    }).on('error', (error) => {
      errorCallback(error); 
    });
      
  }
  if(dataRequest.post_data){
    post_req.write(post_data);
  }
  post_req.end();
 }