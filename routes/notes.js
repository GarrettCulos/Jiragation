var express 		= require('express');
var notes 			= express.Router();
var Notes 			= require('../models/notes');
var fs 				= require('fs');

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

notes.post('/add_note', function(req, res, next) { 
	var note = req.query;
	Notes.addNote(note, function(result){
		// console.log('routes - accout');
		res.send(result);		
	});
});

notes.post('/edit_note', function(req, res, next) { 
	var note_id = req.body;
	Notes.editNote(note_id, function(result){
		// console.log('routes - accout');
		res.send(result);		
	});
});


module.exports.notes = notes;