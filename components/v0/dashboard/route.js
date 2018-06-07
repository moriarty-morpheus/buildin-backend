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

dashboardRouter.use(passport.authenticate('bearer',{session:false}));
dashboardRouter.get(
    '/user_list',
    function(req, res, next) {
    	req.permission_id = 'get_users_list';
    	next();
    },
    authorization.isAuthorized,
    dashboardController.getUsersList
);

dashboardRouter.post(
    '/approve',
    function(req, res, next) {
    	req.permission_id = 'update_user_approval_status';
    	next();
    },
    authorization.isAuthorized,
    dashboardController.updateApprovalStatus
);

dashboardRouter.post(
    '/activate',
    function(req, res, next) {
    	req.permission_id = 'update_user_active_status';
    	next();
    },
    authorization.isAuthorized,
    dashboardController.updateApprovalStatus
);

module.exports = dashboardRouter;
