/*jshint node: true */
'use strict';
/**
  import npm modules
*/
const passport = require('passport');
const bearerStrategy = require('passport-http-bearer');
const actionsStore = require('../../../database/store').actionsStore;
const Sessions = new actionsStore.Sessions('v0');

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(id, done) {
    return done(null, id);
});

passport.use(new bearerStrategy(
  function(token, done) {
    let tokenPromise = Sessions.getAccessToken({ access_token: token });
    tokenPromise.then(function(accessTokenResult) {
      if (!accessTokenResult) { return done(null, false); }
      if (accessTokenResult.code === 200) {
        return done(null, accessTokenResult.data);
      } else {
        return done(null, false);
      }
    }, function(error) {
    	return done(error)
    });
  }
));
