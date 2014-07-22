'use strict';

var config = require('../config/oauth.js');

var mongoose = require('mongoose'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
	TwitterStrategy = require('passport-twitter').Strategy,
    FacebookStrategy = require('passport-facebook').Strategy,
    GoogleStrategy = require('passport-google').Strategy,
    GitHubStrategy = require('passport-github').Strategy,
    OpenIDStrategy = require('passport-openid').Strategy,
    User = mongoose.model('User');

// Serialize sessions
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findOne({ _id: id }, function (err, user) {
    done(err, user);
  });
});

// Use local strategy
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(email, password, done) {
    User.findOne({ email: email }, function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, {
          'errors': {
            'email': { type: 'Email is not registered.' }
          }
        });
      }
      if (!user.authenticate(password)) {
        return done(null, false, {
          'errors': {
            'password': { type: 'Password is incorrect.' }
          }
        });
      }
      return done(null, user);
    });
  }
));

passport.use(new TwitterStrategy({
	consumerKey: config.twitter.consumerKey,
    consumerSecret: config.twitter.consumerSecret,
    callbackURL: config.twitter.callbackURL
}, function(accessToken, refreshToken, profile, done) {
console.info(profile);
	User.findOne({provider_id: profile.id}, function(err, user) {
		if(err) throw(err);
		if(!err && user!= null) return done(null, user);
console.info(profile);
		var user = new User({
			username: profile.screen_name,
			provider_id: profile.id,
			provider: profile.provider,
			name: profile.name
		});
		user.save(function(err) {
			if(err) throw err;
			done(null, user);
		});
	});
}));

passport.use(new FacebookStrategy({
	clientID: config.facebook.clientID,
	clientSecret: config.facebook.clientSecret,
	callbackURL: config.facebook.callbackURL
}, function(accessToken, refreshToken, profile, done) {
	User.findOne({provider_id: profile.id}, function(err, user) {
		if(err) throw(err);
		if(!err && user!= null) return done(null, user);
		var user = new User({
			username: profile.emails[0].value,
			email: profile.emails[0].value,
			provider_id: profile.id,
			provider: profile.provider,
			name: profile.displayName
		});
		user.save(function(err) {
			if(err) throw err;
			done(null, user);
		});
	});
}));

passport.use(new OpenIDStrategy({
    returnURL: config.openid.returnURL,
    realm: config.openid.realm
  },
  function(identifier, done) {
	console.info(identifier);
    User.findOne({ provider_id: identifier }, function(err, user) {
		if(err) throw(err);
		if(!err && user!= null) return done(null, user);
		var user = new User({
			username: 'eduopenid',
			email: 'ebenito101@gmail.com',
			provider_id: identifier,
			provider: 'openid',
			name: 'EDU OPENID'
		});
		user.save(function(err) {
			if(err) throw err;
			done(null, user);
		});
    });
  }
));
