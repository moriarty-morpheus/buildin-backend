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
const validator = require('../middleware/validation');

authRouter.post(
    '/set_permissions',
    function(req, res, next) {
      req.validation = {
        params: [],
        query: [{
          name: "admin_code",
          validations: ["required"]
        }, {
          name: "user_id",
          validations: ["required"]
        }],
        body: [{
          name: "permissions",
          validations: ["required"]
        }]
      }
      next();
    },
    validator.validateReq,
    authController.setPermissions,
    authController.sendResponse
);

authRouter.post(
    '/register',
    function(req, res, next) {
      req.validation = {

      },
      next();
    },
    function(req, res, next) {
      req.validation = {
        params: [],
        query: [],
        body: [{
          name: "user_name",
          validations: ["required"]
        }, {
          name: "email",
          validations: ["required", "isEmail"]
        }, {
          name: "password",
          validations: ["required","isStrongPassword"]
        }, {
          name: "condominium",
          validations: ["required"]
        }, {
          name: "contact_number"
          // validations: ["required"]
        }]
      }
      next();
    },
    validator.validateReq,
    authController.register,
    authController.sendResponse
);

authRouter.post(
    '/login',
    function(req, res, next) {
      req.validation = {
        params: [],
        query: [],
        body: [{
          name: "user_name",
          validations: ["required"]
        }, {
          name: "password",
          validations: ["required"]
        }]
      }
      next();
    },
    validator.validateReq,
    authController.login,
    authController.sendResponse
);

authRouter.post(
    '/forgot_password',
    function(req, res, next) {
      req.validation = {
        params: [],
        query: [],
        body: [{
          name: "user_name",
          validations: ["required"]
        }, {
          name: "email",
          validations: ["required"]
        }]
      }
      next();
    },
    validator.validateReq,
    authController.forgotPasswordToken,
    authController.sendResponse
);

authRouter.post(
    '/reset_password',
    function(req, res, next) {
      req.validation = {
        params: [],
        query: [{
          name: "id",
          validations: ["required"]
        }],
        body: [{
          name: "password",
          validations: ["required"]
        }]
      }
      next();
    },
    validator.validateReq,
    authController.resetPassword,
    authController.sendResponse
);

authRouter.get(
    '/reset_password',
    function(req, res, next) {
      req.validation = {
        params: [],
        query: [{
          name: "id",
          validations: ["required"]
        }],
        body: []
      }
      next();
    },
    validator.validateReq,
    authController.resetPasswordCheck,
    authController.sendResponse
);

authRouter.delete(
    '/logout',
    passport.authenticate('bearer',{session:false}),
    function(req, res, next) {
      req.validation = {
        params: [],
        query: [],
        body: []
      }
      next();
    },
    validator.validateReq,
    authController.logout,
    authController.sendResponse
);

module.exports = authRouter;
