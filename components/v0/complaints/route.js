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
  	req.permission_id = 'get_all_complaints_list';
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
  	req.permission_id = 'get_own_complaints_list';
  	next();
  },
  function(req, res, next) {
    req.validation = {
      params: [{
        name: "user_id",
        validations: ["required"]
      }],
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
  	req.permission_id = 'get_complaint';
  	next();
  },
  function(req, res, next) {
    req.validation = {
      params: [{
        name: "complaint_id",
        validations: ["required"]
      }],
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
  	req.permission_id = 'edit_complaint';
  	next();
  },
  function(req, res, next) {
    req.validation = {
      params: [{
        name: "complaint_id",
        validations: ["required"]
      }],
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
  	req.permission_id = 'delete_complaint';
  	next();
  },
  function(req, res, next) {
    req.validation = {
      params: [{
        name: "complaint_id",
        validations: ["required"]
      }],
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
    	req.permission_id = 'add_complaint';
    	next();
    },
    authorization.isAuthorized,
    function(req, res, next) {
      req.validation = {
        params: [],
        query: [],
        body: [{
          name: "location",
          validations: ["required"]
        }, {
          name: "title",
          validations: ["required"]
        }, {
          name: "details",
          validations: ["required"]
        }, {
          name: "name",
          validations: ["required"]
        }]
      }
      next();
    },
    validator.validateReq,
    complaintsController.addComplaint,
    complaintsController.sendResponse
);

module.exports = complaintsRouter;
