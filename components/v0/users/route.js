/*jshint node: true*/
'use strict';
/**
 *  Create auth router instance
 */
require('../authentication/strategy')
const express = require('express');
const passport = require('passport');
const usersRouter = express.Router();
const usersController = require('./controller');
const authorization = require('../middleware/authorization');
const validator = require('../middleware/validation');

usersRouter.use(passport.authenticate('bearer',{session:false}));

usersRouter.get(
    '/user_list',
    function(req, res, next) {
    	req.permission_id = 'get_users_list';
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
    usersController.getUsersList,
    usersController.sendResponse
);

usersRouter.get(
    '/my_data',
    function(req, res, next) {
    	req.permission_id = 'get_users_list';
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
    usersController.getUserData,
    usersController.sendResponse
);


usersRouter.post(
    '/approve',
    function(req, res, next) {
    	req.permission_id = 'update_user_approval_status';
    	next();
    },
    authorization.isAuthorized,
    function(req, res, next) {
      req.validation = {
        params: [],
        query: [],
        body: [{
          name: "update",
          validations: ["required"]
        }]
      }
      next();
    },
    validator.validateReq,
    usersController.updateApprovalStatus,
    usersController.sendResponse
);

usersRouter.post(
    '/activate',
    function(req, res, next) {
    	req.permission_id = 'update_user_active_status';
    	next();
    },
    authorization.isAuthorized,
    function(req, res, next) {
      req.validation = {
        params: [],
        query: [],
        body: [{
          name: "update",
          validations: ["required"]
        }]
      }
      next();
    },
    validator.validateReq,
    usersController.updateApprovalStatus,
    usersController.sendResponse
);

module.exports = usersRouter;
