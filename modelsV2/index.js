// This code is built by Sequelize No Changes Required. Only Update Database Details
var env       = process.env.NODE_ENV || "development";
var config    = require('../config/config.json')[env];
var fs        = require('fs')
var path      = require('path');
var Sequelize = require('sequelize');
var lodash    = require('lodash');
var sequelize = new Sequelize(config.database.database, config.database.username, config.database.password, config.database.options);

var db        = {};

fs.readdirSync(__dirname)
  .filter(function(file) {
    return ((file.indexOf('.') !== 0) && (file !== 'index.js') && (file.slice(-3) === '.js'));
  })
  .forEach(function(file) {
    var model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});

module.exports = lodash.extend({
  sequelize: sequelize,
  Sequelize: Sequelize
}, db);

