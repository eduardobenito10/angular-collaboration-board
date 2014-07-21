'use strict';

var mongoose = require('mongoose'),
  Board = mongoose.model('Board');

/**
 * Find board by id
 */
exports.board = function(req, res, next, id) {
  Board.load(id, function(err, board) {
    if (err) return next(err);
    if (!board) return next(new Error('Failed to load board ' + id));
    req.board = board;
    next();
  });
};

/**
 * Create a board
 */
exports.create = function(req, res) {
  var board = new Board(req.body);
  board.creator = req.user;

  board.save(function(err) {
    if (err) {
      res.json(500, err);
    } else {
      res.json(board);
    }
  });
};

/**
 * Update a board
 */
exports.update = function(req, res) {
  var board = req.board;
  board.title = req.body.title;
  board.content = req.body.content;
  board.users = req.body.users;
  board.save(function(err) {
    if (err) {
      res.json(500, err);
    } else {
      res.json(board);
    }
  });
};

/**
 * Delete a board
 */
exports.destroy = function(req, res) {
  var board = req.board;

  board.remove(function(err) {
    if (err) {
      res.json(500, err);
    } else {
      res.json(board);
    }
  });
};

/**
 * Show a board
 */
exports.show = function(req, res) {
  res.json(req.board);
};

/**
 * List of Boards
 */
exports.all = function(req, res) {
  Board.find().sort('-created').populate('creator', 'username').exec(function(err, boards) {
    if (err) {
      res.json(500, err);
    } else {
      res.json(boards);
    }
  });
};
