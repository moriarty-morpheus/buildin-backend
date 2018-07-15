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
const Complaints = new actionsStore.Complaints('v0');
const componentConstants = require('./constants');
/**
 * Complaints controller
 */
const controller = {};

/**
 *  Get list of complaints logged by the users
 *  @param {object}  req - request object.
 *  @param {object}  res - response object.
 *  @return {object}
 */
controller.getComplaintsList = function(req, res, next) {
  logger.debug('getComplaintsList controller', logFn(req, null, null));
  logger.info('getComplaintsList controller', logFn(req, null, null));
  let complaintsListPromise = Complaints.getAllComplaints({});
  let response;
  complaintsListPromise.then(function(complaintsListResult) {
    if (complaintsListResult.code === 200) {
      if (complaintsListResult.data.length > 0) {
        for (let k = 0; k < complaintsListResult.data.length; k++) {
          complaintsListResult.data[k] = _.pick(complaintsListResult.data[k],
          componentConstants.fieldsInResponse.adminList);
        }
        response = responseStore.get(200);
        response.data = complaintsListResult.data;
        res.finalResponse = response;
        res.finalMessage = "getComplaintsList Successful";
        next();
      } else {
        response = responseStore.get(200);
        response.data = [];
        res.finalResponse = response;
        res.finalMessage = "getComplaintsList Successful";
        next();
      }
    } else {
      response = responseStore.get(500);
      res.finalResponse = response;
      res.finalMessage = "getComplaintsList complaintsListPromise failed";
      next();
    }
  }, function(error) {
    res.error = error;
    res.finalResponse = response;
    res.finalMessage = "getComplaintsList complaintsListPromise failed";
    next();
  });
}

/**
 *  Get list of complaints logged by the users
 *  @param {object}  req - request object.
 *  @param {object}  res - response object.
 *  @return {object}
 */
controller.getUserComplaintsList = function(req, res, next) {
  logger.debug('getUserComplaintsList controller', logFn(req, null, null));
  logger.info('getUserComplaintsList controller', logFn(req, null, null));
  let userId = req.params.user_id ? [req.params.user_id] : [];
  let complaintsListPromise = Complaints.getComplaintsByUserIds(userId, {});
  let response;
  complaintsListPromise.then(function(complaintsListResult) {
    if (complaintsListResult.code === 200) {
      if (complaintsListResult.data.length > 0) {
        for (let k = 0; k < complaintsListResult.data.length; k++) {
          complaintsListResult.data[k] = _.pick(complaintsListResult.data[k],
          componentConstants.fieldsInResponse.userList);
        }
        response = responseStore.get(200);
        response.data = complaintsListResult.data;
        res.finalResponse = response;
        res.finalMessage = "getUserComplaintsList Successful";
        next();
      } else {
        response = responseStore.get(200);
        response.data = [];
        res.finalResponse = response;
        res.finalMessage = "getUserComplaintsList Successful";
        next();
      }
    } else {
      response = responseStore.get(500);
      res.finalResponse = response;
      res.finalMessage = "getUserComplaintsList complaintsListPromise failed";
      next();
    }
  }, function(error) {
    res.error = error;
    response = responseStore.get(500);
    res.finalResponse = response;
    res.finalMessage = "getUserComplaintsList complaintsListPromise failed";
    next();
  });
}

/**
 *  Create a complaint added by the user
 *  @param {object}  req - request object.
 *  @param {object}  res - response object.
 *  @return {object}
 */
controller.addComplaint = function(req, res, next) {
  logger.debug('addComplaint controller', logFn(req, null, null));
  logger.info('addComplaint controller', logFn(req, null, null));
  let complaintsObj = req.body;
  complaintsObj.user_id = req.user.user_id;
  let addComplaintPromise = Complaints.createComplaint(complaintsObj);
  let response;
  addComplaintPromise.then(function(addResult) {
    if (addResult.code === 200) {
      response = responseStore.get(201);
      response.message = "Complaint/Task saved successfully.";
      res.finalResponse = response;
      res.finalMessage = "addComplaint Successful";
      next();
    } else {
      response = responseStore.get(500);
      res.finalResponse = response;
      res.finalMessage = "addComplaint addComplaintPromise failed";
      next();
    }
  }, function(error) {
    res.error = error;
    response = responseStore.get(500);
    res.finalResponse = response;
    res.finalMessage = "addComplaint addComplaintPromise failed";
    next();
  });
}

/**
 *  Create a complaint added by the user
 *  @param {object}  req - request object.
 *  @param {object}  res - response object.
 *  @return {object}
 */
controller.editComplaint = function(req, res, next) {
  logger.debug('editComplaint controller', logFn(req, null, null));
  logger.info('editComplaint controller', logFn(req, null, null));
  let complaintId = req.params.complaint_id;
  let complaintsObj = req.body;
  let editComplaintPromise = Complaints.updateAComplaint(complaintId, complaintsObj);
  let response;
  editComplaintPromise.then(function(addResult) {
    if (addResult.code === 200) {
      response = responseStore.get(201);
      response.message = "Complaint/Task edited successfully.";
      res.finalResponse = response;
      res.finalMessage = "editComplaint Successful";
      next();
    } else {
      response = responseStore.get(500);
      res.finalResponse = response;
      res.finalMessage = "editComplaint editComplaintPromise failed";
      next();
    }
  }, function(error) {
    res.error = error;
    res.finalResponse = response;
    res.finalMessage = "editComplaint editComplaintPromise failed";
    next();
  });
}

/**
 *  Delete a complaint added by the user
 *  @param {object}  req - request object.
 *  @param {object}  res - response object.
 *  @return {object}
 */
controller.deleteComplaint = function(req, res, next) {
  logger.debug('deleteComplaint controller', logFn(req, null, null));
  logger.info('deleteComplaint controller', logFn(req, null, null));
  let complaintId = req.params.complaint_id ? [req.params.complaint_id] : [];
  let complaintsObj = req.body;
  let deleteComplaintPromise = Complaints.deleteComplaints(complaintId);
  let response;
  deleteComplaintPromise.then(function(addResult) {
    if (addResult.code === 200) {
      response = responseStore.get(200);
      response.message = "Complaint/Task deleted successfully.";
      res.finalResponse = response;
      res.finalMessage = "deleteComplaint Successful";
      next();
    } else {
      response = responseStore.get(500);
      res.finalResponse = response;
      res.finalMessage = "deleteComplaint deleteComplaintPromise failed";
      next();
    }
  }, function(error) {
    res.error = error;
    res.finalResponse = response;
    res.finalMessage = "deleteComplaint deleteComplaintPromise failed";
    next();
  });
}

/**
 *  Get a complaint by its id
 *  @param {object}  req - request object.
 *  @param {object}  res - response object.
 *  @return {object}
 */
controller.getComplaint = function(req, res, next) {
  logger.debug('getComplaint controller', logFn(req, null, null));
  logger.info('getComplaint controller', logFn(req, null, null));
  let complaintId = req.params.complaint_id ? [req.params.complaint_id] : [];
  let getComplaintPromise = Complaints.getComplaintsByIds(complaintId);
  let response;
  getComplaintPromise.then(function(complaintsResult) {
    if (complaintsResult.code === 200) {
      if (complaintsResult.data.length > 0) {
        response = responseStore.get(200);
        response.data = complaintsResult.data[0];
        response.message = "Fetching Complaints/Task successfull.";
        res.finalResponse = response;
        res.finalMessage = "getComplaint Successful";
        next();
      } else {
        response = responseStore.get(404);
        response.message = "No Complaint/Task Found";
        res.finalResponse = response;
        res.finalMessage = "getComplaint Not Found Error";
        next();
      }
    } else {
      response = responseStore.get(500);
      res.finalResponse = response;
      res.finalMessage = "getComplaint getComplaintPromise failed";
      next();
    }
  }, function(error) {
    res.error = error;
    response = responseStore.get(500);
    res.finalResponse = response;
    res.finalMessage = "getComplaint getComplaintPromise failed";
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
