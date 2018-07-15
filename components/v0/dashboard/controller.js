/*jshint node: true */
"use strict";
/**
 * Import Required Node Modules
 */
const Q = require('q');
const _ = require('underscore');
/**
 * Import Required Project Modules
 */
const actionsStore = require('../../../database/store').actionsStore;
const responseStore = require('../../utility/store').responseStore;
const logger = require('../../utility/userLogs').logger;
const logFn = require('../../utility/userLogs').logFn;
const constants = require('../../utility/constants');
const helper = require('./helper');
const Users = new actionsStore.Users('v0');
const Sessions = new actionsStore.Sessions('v0');
const componentConstants = require('./constants');

/**
 * Dashboard controller
 */
const controller = {};

/**
 *  Get lists of tabs for a user
 *  @param {object}  req - request object.
 *  @param {object}  res - response object.
 *  @return {object}
 */
controller.getTabsList = function(req, res, next) {
  logger.debug('getTabsList controller', logFn(req, null, null));
  logger.info('getTabsList controller', logFn(req, null, null));
  let response = responseStore.get(200);
  if (req.user.is_admin) {
    response.data = componentConstants.tabsList.admin;
  } else {
    response.data = componentConstants.tabsList.user;
  }
  res.finalResponse = response;
  res.finalMessage = "getTabsList Successful";
  next()
}

/**
 *  Function to handle response sending
 *  @param {object}  req - request object.
 *  @param {object}  res - response object.
 *  @return {object}
 */
controller.sendResponse = function(req, res, next) {
  let result = res.finalResponse;
  if (constants.responseCodes.error.indexOf(res.finalResponse.code) > -1) {
    result.actualError = res.error;
    logger.debug(
      res.finalMessage,
      logFn(_.omit(req, "body"), null, result)
    );
    logger.error(
      res.finalMessage,
      logFn(_.omit(req, "body"), null, result)
    );
  } else {
    logger.debug(
      res.finalMessage,
      logFn(_.omit(req, "body"), null, result)
    );
    logger.info(
      res.finalMessage,
      logFn(_.omit(req, "body"), null, result)
    );
  }
  return res.status(res.finalResponse.code).send(_.omit(res.finalResponse,"actualError"));
}

module.exports = controller;
