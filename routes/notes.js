var express 		= require('express');
var notes 			= express.Router();
var Notes 			= require('../models/notes');
var fs 				= require('fs');

notes.get('/get_notes', function(req, res, next) { 
	if(req.decoded != null){
		Notes.getNotes(function(result){
			res.send(result);		
		});
	}
	else{
		res.stats(401).send('Unauthorized Request');
	}
});

notes.get('/get_notes_by_ids', function(req, res, next) { 
	if(req.decoded != null){
		Notes.getNotesByIds(req, function(result){
			res.send(result);		
		});
	}
	else{
		res.stats(401).send('Unauthorized Request');
	}
});

notes.post('/add_note', function(req, res, next) { 
	if(req.decoded != null){
		Notes.addNote(req, function(result){
			res.send(result);		
		});
	}
	else{
		res.stats(401).send('Unauthorized Request');
	}
});

notes.post('/edit_note', function(req, res, next) { 
	if(req.decoded != null){
		Notes.editNote(req, function(result){
			res.send(result);		
		});
	}
	else{
		res.stats(401).send('Unauthorized Request');
	}
});


module.exports.notes = notes;