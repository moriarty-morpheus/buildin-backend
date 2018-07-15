/*jshint node: true*/
'use strict';
/**
 *  Create auth router instance
 */
require('../authentication/strategy')
const express = require('express');
const passport = require('passport');
const complaintsRouter = express.Router();
const complaintsController = require('./controller');
const authorization = require('../middleware/authorization');
const validator = require('../middleware/validation');

complaintsRouter.use(passport.authenticate('bearer',{session:false}));

complaintsRouter.get(
  '/list',
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
  complaintsController.getComplaintsList,
  complaintsController.sendResponse
);

complaintsRouter.get(
  '/list/:user_id',
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
  complaintsController.getUserComplaintsList,
  complaintsController.sendResponse
);

complaintsRouter.get(
  '/:complaint_id',
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
  complaintsController.getComplaint,
  complaintsController.sendResponse
);

complaintsRouter.put(
  '/:complaint_id',
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
  complaintsController.editComplaint,
  complaintsController.sendResponse
);

complaintsRouter.delete(
  '/:complaint_id',
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
  complaintsController.deleteComplaint,
  complaintsController.sendResponse
);

complaintsRouter.post(
    '/',
    function(req, res, next) {
    	req.permission_id = 'get_users_list';
    	next();
    },
    authorization.isAuthorized,
    function(req, res, next) {
      req.validation = {
        params: [],
        query: [],
        body: []
      }
      next();
    },
    validator.validateReq,
    complaintsController.addComplaint,
    complaintsController.sendResponse
);

module.exports = complaintsRouter;