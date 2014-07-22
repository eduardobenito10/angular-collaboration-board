'use strict';

// Module dependencies.
var express = require('express'),
    http = require('http'),
    passport = require('passport'),
    path = require('path'),
    fs = require('fs'),
    mongoStore = require('connect-mongo')(express),
    config = require('./lib/config/config');

var app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server);

// Connect to database
//var db = require('./lib/db/mongo').db;

var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = mongoose.Types.ObjectId,
  crypto = require('crypto');

mongoose.connect('mongodb://eduardobenito10:1234@ds053479.mongolab.com:53479/iberica-backlog');

// Bootstrap models
var modelsPath = path.join(__dirname, 'lib/models');
fs.readdirSync(modelsPath).forEach(function (file) {
    require(modelsPath + '/' + file);
});

var pass = require('./lib/config/pass');

app.configure(function() {
    app.use(express.static(__dirname + '/app'));
});


// App Configuration
app.configure('development', function(){
  app.use(express.static(path.join(__dirname, '.tmp')));
  app.use(express.static(path.join(__dirname, 'app')));
  app.use(express.errorHandler());
  app.set('views', __dirname + '/app/views');
});

app.configure('production', function(){
  app.use(express.favicon(path.join(__dirname, 'public', 'favicon.ico')));
  app.use(express.static(path.join(__dirname, 'public')));
  app.set('views', __dirname + '/views');
});

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.logger('dev'));

// cookieParser should be above session
app.use(express.cookieParser());

// bodyParser should be above methodOverride
app.use(express.bodyParser());
app.use(express.methodOverride());

// express/mongo session storage
app.use(express.session({
  secret: 'MEAN'/*,
  store: new mongoStore({
    url: config.db,
    collection: 'sessions'
  })*/
}));

// use passport session
app.use(passport.initialize());
app.use(passport.session());

var Note = mongoose.model('Note');

io.sockets.on('connection', function(socket) {
	Note.find(function(err, notes) {
		socket.emit('init', notes);
	});

	socket.on('createNote', function(data) {
		Note.create({
            text: data.text,
			author: data.author,
            color: data.color,
            x: data.x,
			y: data.y,
            completed: data.complete
        }, function(err, notes){
			data._id = notes._id;
			io.sockets.emit('onNoteCreated', data);
        });
	});

	socket.on('updateNote', function(data) {
		if (data){
			console.info('updateNote');
			Note.findOne({ _id: new ObjectId(data._id) }, function (err, note){
			  if(data.text)
			    note.text = data.text;
		      if(data.author)
				note.author = data.author;
			  note.save();
			});
			socket.broadcast.emit('onNoteUpdated', data);
		}
	});

	socket.on('moveNote', function(data){
		Note.findOne({ _id: new ObjectId(data._id) }, function (err, note){
		  note.x = data.x;
		  note.y = data.y;
		  note.save();
		});
		socket.broadcast.emit('onNoteMoved', data);
	});

	socket.on('deleteNote', function(data){
		Note.remove({
			_id: data._id
		}, function(err, notes){
        });
		socket.broadcast.emit('onNoteDeleted', data);
	});
});

//routes should be at the last
app.use(app.router);

//Bootstrap routes
require('./lib/config/routes')(app);

// Start server
var port = process.env.PORT || 1337;
server.listen(port, function () {
  console.log('Express server listening on port %d in %s mode', port, app.get('env'));
});
