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

// POST: /api/v1/logs
exports.get_time_log = function( req, res ){
    var queryString  = " SELECT "
        queryString += " ts.task_id as task_id, ";
        queryString += " ts.start_time as start_time, ";
        queryString += " ts.end_time as end_time, ";
        queryString += " ts.account_id as account_id, ";
        queryString += " ac.user_name as user_name, ";
        queryString += " ac.url as url, ";
        queryString += " ac.account_email as account_email, ";
        queryString += " ac.protocal as protocal ";
        queryString += " FROM time_sheet ts ";
        queryString += " JOIN jira_accounts ac ON ac.id = ts.account_id";
        queryString += " WHERE 1=1 ";
        if(req.query.startTime){
            queryString += " AND ts.start_time >= '" + req.query.startTime + "' ";
        }
        if(req.query.endTime){
            queryString += " AND ts.start_time <= '" + req.query.endTime + "' ";
        }
        queryString += " AND ts.end_time IS NOT NULL ";
        queryString += " AND ts.user_id = "+req.decoded.id;


    sequelize.query(queryString, { type: Sequelize.QueryTypes.SELECT }).then(function(results){
        return res.send({
            error:false,
            data:results,
            message:"success"
        });

    }).catch(function(err){
        throw err;
        return res.status(400).send({
            error:false,
            data:err,
            message:"Failed to retrieve time log"
        });

    });
}

exports.post_log = function( req, res ){
    JiraC.logTaskTime(req.body.account_id, req.body, function(response){

        return res.send({
            error:false,
            data: response,
            message:"success"
        });

    }, function(error){

        return res.status(400).send({
            error:true,
            data: error,
            message:"success"
        }); 

    });
}
exports.get_worklogs = function( req, res ){
    JiraC.getUserWorklogs(req.query.account_id, req.query.date, function(response, account){
        var promiseArray = []
        
        response = JSON.parse(response);
        for(var i=0; i<response.issues.length; i++ ){
            promiseArray.push(JiraC.getWorklog(account, response.issues[i].key))
        }
        
        Promise.all(promiseArray).then(function(r, key){
            var ret = []
            for(var j=0; j<r.length; j++){
                r[j] = JSON.parse(r[j]);
                r[j].key = response.issues[j].key
                ret.push(JSON.stringify(r[j]))
            }
            return res.send({
                error:false,
                data: ret,
                message:"success"
            });
        })
        
    }, function(error){

        return res.status(400).send({
            error:true,
            data: error,
            message:"success"
        });

    });
}