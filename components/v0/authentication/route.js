/*jshint node: true*/
'use strict';
/**
 *  Create auth router instance
 */
require('../authentication/strategy')
const express = require('express');
const passport = require('passport');
const authRouter = express.Router();
const authController = require('./controller');

authRouter.post(
    '/register',
    authController.register
);

authRouter.post(
    '/login',
    authController.login
);

authRouter.delete(
    '/logout',
    passport.authenticate('bearer',{session:false}),
    authController.logout
);

module.exports = authRouter;
