'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var NoteSchema = new Schema({
    text: String,
    color: String,
    y: Number,
    x: Number,
    completed: Boolean,
	board: {
	  type: Schema.ObjectId,
      ref: 'Board'
    },
	asignedTo: {
		type: Schema.ObjectId,
		ref: 'User'
	},
});

// Definición de modelos
var Note = mongoose.model('Note', NoteSchema);
