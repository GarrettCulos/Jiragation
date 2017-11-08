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
exports.getNoteType = function( req, res ){

  var queryString  = " SELECT "
    queryString += " nt.id as id, ";
    queryString += " nt.type as type,";
    queryString += " nt.type_description as description";
    queryString += " FROM note_type nt ";

  sequelize.query(queryString, { type: Sequelize.QueryTypes.SELECT }).then(function(results){
    
    return res.send({
      error:false,
      data:results,
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

exports.get = function( req, res ){
  var queryString  = " SELECT "
    queryString += " n.id as note_id,";
    queryString += " n.reminder_time as reminder_time, "
    queryString += " n.note as note,";
    queryString += " n.createdAt as createdAt,";
    queryString += " n.updatedAt as updatedAt,";
    queryString += " n.is_active as is_active,";

    queryString += " nm.meta_relation as linked_to,";
    queryString += " nt.id as note_type_id";

    queryString += " FROM note n ";
    queryString += " JOIN note_meta nm ON n.id = nm.note_id";
    queryString += " JOIN note_type nt ON nm.type_id = nt.id";
    queryString += " WHERE n.user_id = "+req.decoded.id;
    if(req.query.is_active){
      queryString += " AND n.is_active = '" + req.query.is_active + "' ";
    }
    if(req.query.min_date){
      queryString += " AND n.updatedAt >= " + req.query.min_date + " ";
    }
    if(req.query.max_date){
      queryString += " AND n.updatedAt <= " + req.query.max_date + " ";
    }
    if(req.query.note_type){
      queryString += " AND nt.type = '" + req.query.note_type + "' ";
    }
    if(req.query.note_type_id){
      queryString += " AND nt.id = '" + req.query.note_type_id + "' ";
    }
    if(req.query.note_meta){
      queryString += " AND nm.meta_relation = '" + req.query.note_meta + "' ";
    }
    if(req.query.note_id){
      queryString += " AND n.id = " + req.query.note_id + "";
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
      error:true,
      data:err,
      message:"Failed to retrieve time log"
    });

  });
  
}

exports.add = function( req, res ){
  
  return sequelize.transaction().then(function(t) {

    return model.note.create({
      note:req.body.note,
      reminder_time: req.body.reminder_time || null,
      is_active:true,
      user_id:req.decoded.id
    }, 
    { 
      transaction: t 
    }).then(function(note) {

      note.dataValues.linked_to = req.body.note_meta.meta_relation;
      note.dataValues.note_type_id = req.body.note_meta.type_id;

      if(!Array.isArray(req.body.note_meta)){
        req.body.note_meta = [req.body.note_meta]
      }

      return model.note_meta.bulkCreate(
        req.body.note_meta.map(function(e){ return {
          note_id: note.dataValues.id,
          meta_relation: e.meta_relation,
          type_id: e.type_id
        }}),
      { 
        transaction:t 
      }).then(function(noteMeta){
        t.commit(note);
        return note;

      }).catch(function(err){
        t.rollback();
        return err;

      })

    }).catch(function(err){ 
      t.rollback();
      return err;

    });

  }).then(function (u) {
    return res.send({message:'Note added', data:u});
  }).catch(function (error) {
    return res.status(400).send({message:'Error adding account', data:error});
  });

}

exports.update = function ( req, res ){

  return sequelize.transaction().then(function(t) {
    
    var note_update = {}
    if(req.body.note !== undefined) {
      note_update.note = req.body.note;
    }
    if(req.body.is_active  !== undefined) {
      note_update.is_active = req.body.is_active;
    }
    if(req.body.reminder_time !== undefined) {
      note_update.reminder_time = req.body.reminder_time;
    }

    return model.note.update(note_update,{
      where: {
        id:        req.body.note_id,
        user_id:   req.decoded.id
      },
      transaction: t 
    }).then(function(note) {

      
      if(req.body.type_id && req.body.meta_relation){
        var meta_update = {}; 
      }
      if(req.body.type_id !== undefined){
        meta_update.type_id = req.body.type_id
      }
      if(req.body.meta_relation !== undefined){
        meta_update.meta_relation = req.body.meta_relation
      }
      if(meta_update){
        return model.note_meta.update(meta_update,{
          where: {
            note_id:   req.body.note_id,
            user_id:   req.decoded.id
          },
          transaction: t 
        }).then(function(note) {

          t.commit(note);
          return note;

        }).catch(function(err){ 

          t.rollback();
          return err;

        });
      }
      else{
        t.commit(note);
        return note
      }

    }).catch(function(err){ 

      t.rollback();
      return err;

    });

  }).then(function (u) {

    return res.send({message:'Note updated', data:u});

  }).catch(function (error) {

    return res.status(400).send({message:'Error updating account', data:error});

  });

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
