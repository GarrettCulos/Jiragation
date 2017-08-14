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
exports.create = function( req, res ){
    return res.send({
        error:false,
        message:"not created"
    })
}

exports.get = function( req, res ){
    JiraC.getTasks(req.decoded.id, function(response){
        return res.send({
            data:response,
            message:'success'
        });
    }, function(error){
        return res.status(400).status({
            message:'error getting tasks'
        })
    });
}

exports.update = function( req, res ){
    return res.send({
        error:false,
        message:"not created"
    })
}


exports.add_time_log = function( req, res ){
    return res.send({
        error:false,
        message:"not created"
    })
}

exports.get_task_time_log = function( req, res ){
    var queryString  = " SELECT "
        queryString += " SUM(ts.end_time - ts.start_time)  as time_logged ";
        queryString += " FROM time_sheet ts ";
        queryString += " JOIN jira_accounts ac ON ac.id = ts.account_id"
        queryString += " WHERE 1=1 "
        if(req.params.startTime){
            queryString += " AND ts.start_time >= '" + req.params.startTime + "' ";
        }
        
        if(req.params.endTime){
            queryString += " AND ts.start_time <= '" + req.params.endTime + "' ";
        }
        queryString += " AND ts.end_time IS NOT NULL ";
        queryString += " AND ts.user_id = "+req.decoded.id;
        if(req.params.id){
            queryString += " AND ts.task_id = '"+req.params.id+"' "
        }

    sequelize.query(queryString, { type: Sequelize.QueryTypes.SELECT }).then(function(results){
        return res.send({
            error:false,
            data:results[0],
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
        queryString += " JOIN jira_accounts ac ON ac.id = ts.account_id"
        queryString += " WHERE 1=1 "
        if(req.params.startTime){
            queryString += " AND ts.start_time >= '" + req.params.startTime + "' ";
        }
        
        if(req.params.endTime){
            queryString += " AND ts.start_time <= '" + req.params.endTime + "' ";
        }
        queryString += " AND ts.end_time IS NOT NULL ";
        queryString += " AND ts.user_id = "+req.decoded.id;
        if(req.params.id){
            queryString += " AND ts.task_id = '"+req.params.id+"' "
        }
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

exports.get_active_tasks = function( req, res ){
    var queryString  = " SELECT "
        queryString +=      " ts.id as id, ";
        queryString +=      " ts.task_id as task_id, ";
        queryString +=      " ts.start_time as start_time, ";
        queryString +=      " ts.end_time as end_time, ";
        queryString +=      " ts.account_id as account_id, ";
        queryString +=      " ac.user_name as user_name, ";
        queryString +=      " ac.url as url, ";
        queryString +=      " ac.account_email as account_email, ";
        queryString +=      " ac.protocal as protocal ";
        queryString += " FROM time_sheet ts ";
        queryString += " JOIN jira_accounts ac ON ac.id = ts.account_id"
        queryString += " WHERE 1=1 "
        queryString += " AND ts.end_time IS NULL ";
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

exports.remove_time_log = function( req, res ){
    return res.send({
        error:false,
        message:"not created"
    })
}

exports.update_time_log = function( req, res ){
    return res.send({
        error:false,
        message:"not created"
    })
}

exports.get_comments = function( req, res ){
  JiraC.getTaskComments(req.params.id, req.query.account_id, function(results){
    return res.send({
      error:false,
      message:"success",
      data: results
    });
  }, function(error){
    return res.status(400).send({
      error:true,
      message:"Error when getting comments"
    });
  });
}

exports.add_comment = function( req, res ){
    return res.send({
        error:false,
        message:"not created"
    })
}

exports.remove_comment = function( req, res ){
    return res.send({
        error:false,
        message:"not created"
    })
}

exports.get_assets = function( req, res ){
    return res.send({
        error:false,
        message:"not created"
    })
}

exports.add_asset = function( req, res ){
    return res.send({
        error:false,
        message:"not created"
    })
}

exports.updateTracking = function( req, res ){
    // var account_id = req.params.id;
    // console.log(model);
    if(req.body.start_time  != undefined){
        model.time_sheet.create({
            task_id:     req.body.task_id,
            start_time:  req.body.start_time,
            account_id:  req.body.account_id,
            user_id:     req.decoded.id
        },{}).then(function (results) {
              
            return res.send({
                data:results,
                message:"log started"
            });

        }, function(err){
            throw err;
            return res.status(400).send({
              message:"Error initiating log",
              data:err
            });

        }); 
    }
    else if ( req.body.end_time != undefined && req.body.timesheet_id  != undefined){
        sequelize.transaction(function (t) { 
            return model.time_sheet.update({
                        end_time:req.body.end_time
                    }, {
                        where: {
                            id: req.body.timesheet_id
                        },
                        fields:{
                            end_time: req.body.end_time
                        },
                        transaction:t
                    }).then(function(user) {
                        return model.time_sheet.findById(req.body.timesheet_id,{transaction:t}).then(function(log){
                            return log
                        })
                    });
        }).then(function (log) {
            return res.status(200).send({
                data:log,
                error:false,
                message:"logged time"
            });

        }).catch(function (error) {
            console.error(error)
            return res.status(400).send({
                data:error,
                message:null
            });
            
        });
    }
    else {
        return res.send({
            error:false,
            message:"not created"
        });    
    }
    
    
}

exports.remove_asset = function( req, res ){
    return res.send({
        error:false,
        message:"not created"
    })
}