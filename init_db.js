var config      =   require('config');

var mysql       = 	require('mysql');

var dbConfig 	= 	config.get('dbConfig');

var Sequelize 	= 	require("sequelize");

var pool 		=  	mysql.createPool({
					    connectionLimit : dbConfig.get('connection_limit'),
					    host :            dbConfig.get('host'),
					    user :            dbConfig.get('user'),
					    password :        dbConfig.get('password'),
					    database :        dbConfig.get('database')
					});

var db 			= {};

var sequelize 	= 	new Sequelize(
						dbConfig.get('database'),
						dbConfig.get('user'),
						dbConfig.get('password'),
						{
							host 	: dbConfig.get('host'),
							dialect : 'mysql',
                            logging	: dbConfig.logging,
							pool 	: {
									max : dbConfig.get('connection_limit'),
									min : 0,
									idle : 10000
								}
						});

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.pool = pool;

module.exports = db;