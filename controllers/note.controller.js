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
  
  var queryString  = " SELECT "
    queryString += " n.id as time_log_id, ";
    queryString += " n.id as note_id,";
    queryString += " n.note as note,";
    queryString += " n.createdAt as created_at,";
    queryString += " n.updatedAt as updated_at,";

    queryString += " nm.meta_relation as linked_to,";
    queryString += " nt.type as note_type,";
    queryString += " nt.type_description as type_description";

    queryString += " FROM note n ";
    queryString += " JOIN note_meta nm ON n.id = nm.note_id";
    queryString += " JOIN note_type nt ON nm.type_id = nt.id";
    queryString += " WHERE n.user_id = "+req.decoded.id;
    if(req.query.note_type){
      queryString += " AND nt.type = '" + req.query.note_type + "' ";
    }
    if(req.query.note_meta){
      queryString += " AND nm.meta_relation = '" + req.query.note_meta + "' ";
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
      error:true,
      data:err,
      message:"Failed to retrieve time log"
    });

  });
  
}

exports.add = function( req, res ){
  
  console.log(req.body);

  return sequelize.transaction().then(function(t) {

    return model.note.create({
      note:req.body.note,
      is_active:true,
      user_id:req.decoded.id
    }, 
    { 
      transaction: t 
    }).then(function(note) {

      return model.note_meta.createBulk(
        req.body.note_meta.map(function(e){ return {
          note_id: note.dataValues.id,
          meta_relation: e.meta_relation,
          type_id: e.type_id
        }}),
      { 
        transaction:t 
      }).then(function(noteMeta){

        return note;
        t.commit();

      }).catch(function(err){
        
        return err;
        t.rollback();

      })

    }).catch(function(err){ 

      return err;
      t.rollback();

    });

  }).then(function (u) {
    
    return res.send({message:'Note added', data:u[0]});

  }).catch(function (error) {
    
    return res.status(400).send({message:'Error adding account', data:error});

  });

}


exports.update = function ( req, res ){

  return res.status(400).send({message:'not created'});

}

exports.remove = function( req, res ){
  // expire do not remove
  
  return sequelize.transaction().then(function (t) {

    return model.note.destroy({
      where: {
        id:req.param.id,
        user_id: req.decoded.id
      },
      transaction:t
    }).then(function (results) {

      return model.note_meta.destroy({
        where: {
          note_id:req.param.id
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

    return res.send({ message:"Note removed" });

  }).catch(function (error) {
    
    return res.status(400).send({ message:"Note note removed" });

  });

}