/*jshint node: true*/
'use strict';
/**
 *  Create auth router instance
 */
require('../authentication/strategy')
const express = require('express');
const passport = require('passport');
const announcementsRouter = express.Router();
const announcementsController = require('./controller');
const authorization = require('../middleware/authorization');
const validator = require('../middleware/validation');

announcementsRouter.use(passport.authenticate('bearer',{session:false}));

announcementsRouter.get(
  '/list',
  function(req, res, next) {
  	req.permission_id = 'get_all_announcements_list';
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
  announcementsController.getAnnouncementsList,
  announcementsController.sendResponse
);

announcementsRouter.get(
  '/:announcement_id',
  function(req, res, next) {
  	req.permission_id = 'get_announcement';
  	next();
  },
  function(req, res, next) {
    req.validation = {
      params: [{
        name: "announcement_id",
        validations: ["required"]
      }],
      query: [],
      body: []
    }
    next();
  },
  authorization.isAuthorized,
  validator.validateReq,
  announcementsController.getAnnouncement,
  announcementsController.sendResponse
);

announcementsRouter.put(
  '/:announcement_id',
  function(req, res, next) {
  	req.permission_id = 'edit_announcement';
  	next();
  },
  function(req, res, next) {
    req.validation = {
      params: [{
        name: "announcement_id",
        validations: ["required"]
      }],
      query: [],
      body: []
    }
    next();
  },
  authorization.isAuthorized,
  validator.validateReq,
  announcementsController.editAnnouncement,
  announcementsController.sendResponse
);

announcementsRouter.delete(
  '/:announcement_id',
  function(req, res, next) {
  	req.permission_id = 'delete_announcement';
  	next();
  },
  function(req, res, next) {
    req.validation = {
      params: [{
        name: "announcement_id",
        validations: ["required"]
      }],
      query: [],
      body: []
    }
    next();
  },
  authorization.isAuthorized,
  validator.validateReq,
  announcementsController.deleteAnnouncement,
  announcementsController.sendResponse
);

announcementsRouter.post(
    '/',
    function(req, res, next) {
    	req.permission_id = 'add_announcement';
    	next();
    },
    authorization.isAuthorized,
    function(req, res, next) {
      req.validation = {
        params: [],
        query: [],
        body: [{
          name: "title",
          validations: ["required"]
        }, {
          name: "details",
          validations: ["required"]
        }]
      }
      next();
    },
    validator.validateReq,
    announcementsController.addAnnouncement,
    announcementsController.sendResponse
);

module.exports = announcementsRouter;
