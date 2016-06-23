var express 			= require('express');
var notes 			= express.Router();
var Notes 			= require('../models/tasks');
var fs 					= require('fs');

notes.get('/get_notes', function(req, res, next) { 
	Notes.getNotes(function(result){
		// console.log('routes - accout');
		res.send(result);		
	});
});

notes.get('/get_notes_by_ids', function(req, res, next) { 
	var note_ids = req.body;
	Notes.getNotesByIds(note_ids, function(result){
		// console.log('routes - accout');
		res.send(result);		
	});
});

notes.get('/add_note', function(req, res, next) { 
	var note = req.body;
	Notes.addNote(note, function(result){
		// console.log('routes - accout');
		res.send(result);		
	});
});

notes.get('/edit_note', function(req, res, next) { 
	var note_id = req.body;
	Notes.editNote(note_id, function(result){
		// console.log('routes - accout');
		res.send(result);		
	});
});


module.exports.notes = notes;