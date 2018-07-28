/*jshint node: true*/
'use strict';
/**
 *  Create auth router instance
 */
require('../authentication/strategy')
const express = require('express');
const passport = require('passport');
const dashboardRouter = express.Router();
const dashboardController = require('./controller');
const authorization = require('../middleware/authorization');
const validator = require('../middleware/validation');

dashboardRouter.use(passport.authenticate('bearer',{session:false}));
dashboardRouter.get(
    '/tabs_list',
    function(req, res, next) {
    	req.permission_id = 'get_tabs_list';
    	next();
    },
    function(req, res, next) {
      req.validation = {
        params: [],
        query: [],
        body: []
      }
      next();
    },
    authorization.isAuthorized,
    validator.validateReq,
    dashboardController.getTabsList,
    dashboardController.sendResponse
);

module.exports = dashboardRouter;
