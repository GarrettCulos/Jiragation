var env = process.env.NODE_ENV || "development";
var config = require('../config/config.json')[env];

var tasks = require('../models/tasks');
var winston = require('winston');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

// POST: /api/v1/task
exports.create = function( req, res, next ){
    res.send({
        error:false,
        message:"not created"
    })
    return next();
}

exports.get = function( req, res, next ){
    res.send({
        error:false,
        message:"not created"
    })
    return next();
}

exports.update = function( req, res, next ){
    res.send({
        error:false,
        message:"not created"
    })
    return next();
}

exports.get = function( req, res, next ){
    res.send({
        error:false,
        message:"not created"
    })
    return next();
}

exports.add_time_log = function( req, res, next ){
    res.send({
        error:false,
        message:"not created"
    })
    return next();
}

exports.get_time_log = function( req, res, next ){
    res.send({
        error:false,
        message:"not created"
    })
    return next();
}

exports.remove_time_log = function( req, res, next ){
    res.send({
        error:false,
        message:"not created"
    })
    return next();
}

exports.update_time_log = function( req, res, next ){
    res.send({
        error:false,
        message:"not created"
    })
    return next();
}

exports.get_comments = function( req, res, next ){
    res.send({
        error:false,
        message:"not created"
    })
    return next();
}

exports.add_comment = function( req, res, next ){
    res.send({
        error:false,
        message:"not created"
    })
    return next();
}

exports.remove_comment = function( req, res, next ){
    res.send({
        error:false,
        message:"not created"
    })
    return next();
}

exports.get_assets = function( req, res, next ){
    res.send({
        error:false,
        message:"not created"
    })
    return next();
}

exports.add_asset = function( req, res, next ){
    res.send({
        error:false,
        message:"not created"
    })
    return next();
}

exports.remove_asset = function( req, res, next ){
    res.send({
        error:false,
        message:"not created"
    })
    return next();
}