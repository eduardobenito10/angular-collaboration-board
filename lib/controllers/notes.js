'use strict';

var mongoose = require('mongoose'),
  ObjectId = mongoose.Types.ObjectId,
  Note = mongoose.model('Note');

/**
 * Find notes by boardId
 */
exports.notes = function(req, res) {
  var board = req.board;
  Note.find({board: new ObjectId(board._id)}).exec(function(err, notes) {
  //Note.find({ board : board._id }).exec(function(err, notes) {
    if (err) {
      res.json(500, err);
    } else {
      res.json(notes);
    }
  });
};
