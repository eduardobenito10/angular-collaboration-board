'use strict';

var path = require('path'),
    auth = require('../config/auth'),
    passport = require('passport');

module.exports = function(app) {
  // User Routes
  var users = require('../controllers/users');
  app.post('/auth/users', users.create);
  app.get('/auth/users/:userId', users.show);
  app.get('/auth/twitter', passport.authenticate('twitter', { scope : ["email"]}));
  app.get('/auth/twitter/callback', passport.authenticate('twitter',
  { successRedirect: '/', 
    failureRedirect: '/login' }));
  app.get('/auth/facebook', passport.authenticate('facebook', { scope : ["email"]}));
  app.get('/auth/facebook/callback', passport.authenticate('facebook',
  { successRedirect: '/', 
    failureRedirect: '/login' }));
  app.post('/auth/openid', passport.authenticate('openid'));
  app.get('/auth/openid/return', passport.authenticate('openid',
  { successRedirect: '/', 
    failureRedirect: '/login' }));
  // Check if username is available
  // todo: probably should be a query on users
  app.get('/auth/check_username/:username', users.exists);

  // Session Routes
  var session = require('../controllers/session');
  app.get('/auth/session', auth.ensureAuthenticated, session.session);
  app.post('/auth/session', session.login);
  app.del('/auth/session', session.logout);

  // Blog Routes
  var blogs = require('../controllers/blogs');
  app.get('/api/blogs', blogs.all);
  app.post('/api/blogs', auth.ensureAuthenticated, blogs.create);
  app.get('/api/blogs/:blogId', blogs.show);
  app.put('/api/blogs/:blogId', auth.ensureAuthenticated, auth.blog.hasAuthorization, blogs.update);
  app.del('/api/blogs/:blogId', auth.ensureAuthenticated, auth.blog.hasAuthorization, blogs.destroy);

  //Setting up the blogId param
  app.param('blogId', blogs.blog);
  
  // User Routes
  var blogs = require('../controllers/users');
  app.get('/api/users', users.all);

  // Board Routes
  var boards = require('../controllers/boards');
  app.get('/api/boards', boards.all);
  app.post('/api/boards', auth.ensureAuthenticated, boards.create);
  app.get('/api/boards/:boardId', auth.board.hasAuthorization, boards.show);
  app.put('/api/boards/:boardId', auth.ensureAuthenticated, auth.board.hasAuthorization, boards.update);
  app.del('/api/boards/:boardId', auth.ensureAuthenticated, auth.board.hasAuthorization, boards.destroy);
  
  //Setting up the boardId param
  app.param('boardId', boards.board);
  
  // Notes Routes
  var notes = require('../controllers/notes');
  app.get('/api/notes/:boardId', auth.ensureAuthenticated, auth.board.hasAuthorization, notes.notes); // CUIDAO
  //Setting up the boardId param
  app.param('boardId', boards.board); // notes.board

  // Angular Routes
  app.get('/partials/*', function(req, res) {
    var requestedView = path.join('./', req.url);
    res.render(requestedView);
  });

  app.get('/*', function(req, res) {
    if(req.user) {
      res.cookie('user', JSON.stringify(req.user.user_info));
    }

    res.render('index.html');
  });

}
