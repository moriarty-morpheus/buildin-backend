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
 * Users controller
 */
const controller = {};

/**
 *  Get list of users
 *  @param {object}  req - request object.
 *  @param {object}  res - response object.
 *  @return {object}
 */
controller.getUsersList = function(req, res, next) {
  logger.debug('getUsersList controller', logFn(req, null, null));
  logger.info('getUsersList controller', logFn(req, null, null));
  let usersListPromise = Users.getAllUsers({});
  let response;
  usersListPromise.then(function(usersListResult) {
    if (usersListResult.code === 200) {
      if (usersListResult.data.length > 0) {
        for (let k = 0; k < usersListResult.data.length; k++) {
          _.pick(usersListResult.data[k], componentConstants.fieldsInResponse.dashboard.usersList);
        }
        response = responseStore.get(200);
        response.data = usersListResult.data;
        res.finalResponse = response;
        res.finalMessage = "getUsersList Successful";
        next();
      } else {
        response = responseStore.get(200);
        response.data = [];
        res.finalResponse = response;
        res.finalMessage = "getUsersList Successful";
        next();
      }
    } else {
      response = responseStore.get(500);
      res.finalResponse = response;
      res.finalMessage = "getUsersList usersListPromise failed";
      next();
    }
  }, function(error) {
    res.error = error;
    res.finalResponse = response;
    res.finalMessage = "getUsersList usersListPromise failed";
    next();
  });
}

/**
 *  Update status of registered users, by the admin
 *  @param {object}  req - request object.
 *  @param {object}  res - response object.
 *  @return {object}
 */
controller.updateApprovalStatus = function(req, res, next) {
  logger.debug('updateApprovalStatus controller', logFn(req, null, null));
  logger.info('updateApprovalStatus controller', logFn(req, null, null));
  let updateObjectsArray = req.body.update ? req.body.update : [];
  let updateStatusPromises = [];
  let user_ids = _.pluck(updateObjectsArray, "user_id");
  let response;
  Users.getUsersByIds(user_ids).then(function(usersListResponse) {
    for (let k = 0; k < updateObjectsArray.length; k++) {
      let user = _.findWhere(usersListResponse.data, {"user_id": user_ids[k]});
      if (user) {
        updateStatusPromises.push(Users.updateUserApprovalStatus(
          user.user_id, updateObjectsArray[k].status
        ));
        let msg;
        if (updateObjectsArray[k].status === true) {
          msg = "Hi " + user.user_name +",\n\tYour account has been approved by our admin.\n\t" +
                "Hurry up and check in.";
        } else {
          msg = "Hi " + user.user_name +",\n\tYour account has been rejected by our admin for the following reason.\n\t" +
                updateObjectsArray[k].reason;
        }
        updateStatusPromises.push(helper.sendApprovalStatusEmailToUser(
          req, res, user.email, msg
        ));
      }
    }
    Q.all(updateStatusPromises).then(function(results) {
      if (results) {
        response = responseStore.get(201);
        response.message = "Status Updated Successfully";
        res.finalResponse = response;
        res.finalMessage = "updateApprovalStatus successful";
        next();
      } else {
        response = responseStore.get(500);
        res.finalResponse = response;
        res.finalMessage = "updateApprovalStatus error";
        next();
      }
    }, function(error) {
      response = responseStore.get(500);
      res.error = error;
      res.finalResponse = response;
      res.finalMessage = "updateApprovalStatus updateStatusPromises failed";
      next();
    });
  }, function(error) {
    response = responseStore.get(500);
    res.error = error;
    res.finalResponse = response;
    res.finalMessage = "updateApprovalStatus getUsersByIds failed";
    next();
  });
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
    result.actualError = res.error ? res.error : {};
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
