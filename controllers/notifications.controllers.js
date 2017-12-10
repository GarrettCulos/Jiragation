var env                 = process.env.NODE_ENV || "development";
var config              = require('../config/config.json')[env];
var db                  = require('../db');
var model               = require('../modelsV2');
var JiraC               = require('../services').jira;

var winston             = require('winston');
var jwt                 = require('jsonwebtoken');
var bcrypt              = require('bcryptjs');

var Sequelize           = db.Sequelize;
var sequelize           = db.sequelize;

// POST: /api/v1/task

exports.bulk_import = function( req, res ){

    return sequelize.transaction().then(function(t) {
      var promises = [];

      req.notifications.map( function(issue){

        delete issue.fields;
        issue.changelog.histories = issue.changelog.histories.slice(Math.max(issue.changelog.histories.length - 11, 0));
        
        promises.push( 
          model.notifications.create({
            data: JSON.stringify( issue.changelog.histories.map( function(c){ delete c.author.avatarUrls; return c;}) ),
            user_id:req.user_id,
            account_id:req.account_id,
            task_id: issue.key,
            status: 1
          }, { 
            transaction: t 
          }).then(function(notification) {

            t.commit(notification);
            return notification;

          }).catch(function(err){ 
            t.commit("");
            return;

          })
        )

      });

      return Promise.all(promises).then( function(response) {
        return response;
      });

    }).then(function (notifications) {
      
      get_notifications({user_id:req.user_id}, function(notific) {

        return res.send({message:'Notification added', data:notific});

      }, function(error) {
        
        return res.send({error:true, message:'Error adding account', data:error});

      });

    }).catch(function (error) {
      
      return res.send({error:true, message:'Error adding account', data:error});

    });
}

exports.get = function( req, res ){

  get_notifications({user_id:req.decoded.id, task_id:req.params.task_id}, function(notifications) {

    return res.send({ data:notifications, message:"success" });

  }, function(error) {
    
    throw error;
    return res.status(400).send({ data:error, message:"Failed to retrieve notifications" });

  });

}

exports.update = function( req, res ){

  return model.notifications.update(req.body, {
    where: {
      id:       req.params.notice_id,
      user_id:  req.decoded.id
    }
  }).then(function(notifications) {
    
    return res.send({message:'Notification added', data:notifications});

  }).catch(function(err){ 
    console.log(err);
    return res.status(400).send({message:'Error adding account', data:err});

  });
}

function get_notifications(data, callback, errorCallback) {

  if(data.task_id) {

    var queryString  = " SELECT "
    queryString += " n.id as notification_id,";
    queryString += " n.data as data,";
    queryString += " n.task_id as task_id,";
    queryString += " n.account_id as account_id,";
    queryString += " n.createdAt as createdAt,";
    queryString += " n.updatedAt as updatedAt,";
    queryString += " n.status as status ";

    queryString += " FROM notifications n ";
    queryString += " WHERE n.user_id = "+data.user_id;
    queryString += " AND n.task_id = '"+data.task_id+"'";
    queryString += " AND n.status = 1";

  } else {
    
    var queryString  = " SELECT "
    queryString += " n.task_id as task_id,";
    queryString += " ( SELECT count(nn.id) FROM notifications nn WHERE nn.task_id = n.task_id AND nn.status = 1 ) as count,";
    queryString += " ( SELECT MAX(nn.updatedAt) FROM notifications nn WHERE nn.task_id = n.task_id AND nn.status = 0 ) as last_snoozed,";
    queryString += " MIN(n.updatedAt) as updatedAt ";
    queryString += " FROM notifications n ";
    queryString += " WHERE n.user_id = "+data.user_id;
    queryString += " AND n.status = 1";
    queryString += " GROUP BY n.task_id "
    
  }

  sequelize.query(queryString, { type: Sequelize.QueryTypes.SELECT }).then(function(results){
    
    callback(results)

  }).catch(function(err){
    console.log(err);
    errorCallback(err);

  });

}
