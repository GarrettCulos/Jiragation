var env         = process.env.NODE_ENV || "development";
var config      = require('./config/config.json')[env];
var mysql       = require('mysql');
var Sequelize   = require("sequelize");
var db          = {};

var pool        = mysql.createPool({
                    connectionLimit: config.database.connection_limit,
                    host:            config.database.options.host,
                    user:            config.database.username,
                    password:        config.database.password,
                    database:        config.database.database
                  });

var sequelize   = new Sequelize( config.database.database, config.database.username, config.database.password, config.database.options);

db.Sequelize    = Sequelize;
db.sequelize    = sequelize;
db.pool         = pool;

module.exports  = db;