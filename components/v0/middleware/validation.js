/*jshint node: true */
'use strict';
/**
 * Import Required Modules
 */
const responseStore = require('../../utility/store').responseStore;
const validationFns = require('../../utility/validator');
const logger = require('../../utility/userLogs').logger;
const logFn = require('../../utility/userLogs').logFn;
const constants = require('../../utility/constants');
const _ = require('underscore');
const sanitizer = require('sanitizer');

const validator = {};

validator.isValidMethod = function(req, res, next) {
  if (req.validation.methods.indexOf(req.method) > -1) {
    next();
  } else {
    let response = responseStore.get(405);
    response.message = "Incorrect Method. Try " + req.validation.methods.join(" or ");
    return res.status(405).send(response);
  }
}

validator.validateReq = function(req, res, next) {
  if (req.validation.params) {
    for (let k = 0; k < req.validation.params.length; k++) {
      let param = req.validation.params[k].name;
      let value = req.params[param] ? req.params[param] : null;
      let validations = req.validation.params[k].validations ? req.validation.params[k].validations : [];
      for (let p = 0; p < validations.length; p++) {
        if (!validationFns[validations[p]](value)) {
          let message;
          if (validations[p] === "required" || validations[p] === "notRequired") {
            message = param + " is " + validations[p];
          } else {
            message = param + " is not valid";
          }
          let response = responseStore.get(422);
          response.error = {
            param: param,
            value: value,
            message: message,
            validation: validations[p]
          }
          logger.debug(
            "Validation Failed",
            logFn(req, null, response)
          );
          logger.error(
            "Validation Failed",
            logFn(req, null, response)
          );
          return res.status(422).send(response);
        }
      }
    }
  }
  if (req.validation.query) {
    for (let k = 0; k < req.validation.query.length; k++) {
      let param = req.validation.query[k].name;
      let value = req.query[param] ? req.query[param] : null;
      let validations = req.validation.query[k].validations ? req.validation.query[k].validations : [];
      for (let p = 0; p < validations.length; p++) {
        if (!validationFns[validations[p]](value)) {
          let message;
          if (validations[p] === "required" || validations[p] === "notRequired") {
            message = param + " is " + validations[p];
          } else {
            message = param + " is not valid";
          }
          let response = responseStore.get(422);
          response.error = {
            param: param,
            value: value,
            message: message,
            validation: validations[p]
          }
          logger.debug(
            "Validation Failed",
            logFn(req, null, response)
          );
          logger.error(
            "Validation Failed",
            logFn(req, null, response)
          );
          return res.status(422).send(response);
        }
      }
    }
  }
  if (req.validation.body) {
    for (let k = 0; k < req.validation.body.length; k++) {
      let param = req.validation.body[k].name;
      let value = req.body[param] ? req.body[param] : null;
      let validations = req.validation.body[k].validations ? req.validation.body[k].validations : [];
      for (let p = 0; p < validations.length; p++) {
        if (!validationFns[validations[p]](value)) {
          let message;
          if (validations[p] === "required" || validations[p] === "notRequired") {
            message = param + " is " + validations[p];
          } else {
            message = param + " is not valid";
          }
          let response = responseStore.get(422);
          response.error = {
            param: param,
            value: value,
            message: message,
            validation: validations[p]
          }
          logger.debug(
            "Validation Failed",
            logFn(req, null, response)
          );
          logger.error(
            "Validation Failed",
            logFn(req, null, response)
          );
          return res.status(422).send(response);
        }
      }
    }
  }
  next();
}

validator.sanitizeRequest = function(json) {
  let jsonString = JSON.stringify(json);
  jsonString = sanitizer.escape(jsonString);
  jsonString = sanitizer.sanitize(jsonString);
  return JSON.parse(jsonString);
};

module.exports = validator;
