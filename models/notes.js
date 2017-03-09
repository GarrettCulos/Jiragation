var db 					= require('../init_db');
var model 				= require('./jiragation');
var Sequelize 			= db.Sequelize;
var sequelize 			= db.sequelize;

var Notes = function() {

};

Notes.getNotes = function(req, callback) {
	// require task id as parameter

};

Notes.getNotesByIds = function(req, callback) {
	// require task id as parameter

};

Notes.addNote = function(req, callback) {
	var note = req.body;
	model.notes.create({
		task_id: note.task_id,
		description: note.description,
		is_active: 1,
		user_id: req.decoded.id	
	}).then(function(results) {
		callback(results);
	}, function(err){
		console.log(err);
		throw err;
	});
};

Notes.editNote = function(req, callback) {
	// require note id as parameter
};

module.exports = Notes;