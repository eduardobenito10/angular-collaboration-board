'use strict';

var _ = require('underscore');

/**
 *  Route middleware to ensure user is authenticated.
 */
exports.ensureAuthenticated = function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.send(401);
}

/**
 * Blog authorizations routing middleware
 */
exports.blog = {
  hasAuthorization: function(req, res, next) {
    if (req.blog.creator._id.toString() !== req.user._id.toString()) {
      return res.send(403);
    }
    next();
  }
};


/**
 * Board authorizations routing middleware
 */
exports.board = {
  hasAuthorization: function(req, res, next) {
    if (req.board.access == 'private' && (req.board.creator._id.toString() !== req.user._id.toString()
    || _.contains(req.board.users, req.user._id.toString()))) {
      return res.send(403);
    }
    next();
  }
};
