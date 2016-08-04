var db 					= require('../init_db');
var model 				= require('./jiragation');
var Sequelize 			= db.Sequelize;
var sequelize 			= db.sequelize;

var Notes = function() {

};

Notes.getNotes = function(callback) {
	// require task id as parameter

};

Notes.getNotesByIds = function(callback) {
	// require task id as parameter

};

Notes.addNote = function(note, callback) {
	model.Notes.create({
		task_id: note.task_id,
		description: note.description,
		is_active: 1
	}).then(function(results) {
		callback(results);
	}, function(err){
		console.log(err);
		throw err;
	});
};

Notes.editNote = function(callback) {
	// require note id as parameter

};

module.exports = Notes;