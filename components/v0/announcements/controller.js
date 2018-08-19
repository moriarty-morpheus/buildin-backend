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
const Announcements = new actionsStore.Announcements('v0');
const componentConstants = require('./constants');
/**
 * Announcements controller
 */
const controller = {};

/**
 *  Get list of announcements logged by the users
 *  @param {object}  req - request object.
 *  @param {object}  res - response object.
 *  @return {object}
 */
controller.getAnnouncementsList = function(req, res, next) {
  logger.debug('getAnnouncementsList controller', logFn(req, null, null));
  logger.info('getAnnouncementsList controller', logFn(req, null, null));
  let announcementsListPromise = Announcements.getAllAnnouncements({});
  let response;
  announcementsListPromise.then(function(announcementsListResult) {
    if (announcementsListResult.code === 200) {
      if (announcementsListResult.data.length > 0) {
        for (let k = 0; k < announcementsListResult.data.length; k++) {
          announcementsListResult.data[k] = _.pick(announcementsListResult.data[k],
          componentConstants.fieldsInResponse.adminList);
        }
        response = responseStore.get(200);
        response.data = announcementsListResult.data;
        res.finalResponse = response;
        res.finalMessage = "getAnnouncementsList Successful";
        next();
      } else {
        response = responseStore.get(200);
        response.data = [];
        res.finalResponse = response;
        res.finalMessage = "getAnnouncementsList Successful";
        next();
      }
    } else {
      response = responseStore.get(500);
      res.finalResponse = response;
      res.finalMessage = "getAnnouncementsList announcementsListPromise failed";
      next();
    }
  }, function(error) {
    res.error = error;
    res.finalResponse = response;
    res.finalMessage = "getAnnouncementsList announcementsListPromise failed";
    next();
  });
}

/**
 *  Create a announcement added by the user
 *  @param {object}  req - request object.
 *  @param {object}  res - response object.
 *  @return {object}
 */
controller.addAnnouncement = function(req, res, next) {
  logger.debug('addAnnouncement controller', logFn(req, null, null));
  logger.info('addAnnouncement controller', logFn(req, null, null));
  let announcementsObj = req.body;
  announcementsObj.user_id = req.user.user_id;
  let addAnnouncementPromise = Announcements.createAnnouncement(announcementsObj);
  let response;
  addAnnouncementPromise.then(function(addResult) {
    if (addResult.code === 200) {
      response = responseStore.get(201);
      response.message = "Announcement/Task saved successfully.";
      res.finalResponse = response;
      res.finalMessage = "addAnnouncement Successful";
      next();
    } else {
      response = responseStore.get(500);
      res.finalResponse = response;
      res.finalMessage = "addAnnouncement addAnnouncementPromise failed";
      next();
    }
  }, function(error) {
    res.error = error;
    response = responseStore.get(500);
    res.finalResponse = response;
    res.finalMessage = "addAnnouncement addAnnouncementPromise failed";
    next();
  });
}

/**
 *  Create a announcement added by the user
 *  @param {object}  req - request object.
 *  @param {object}  res - response object.
 *  @return {object}
 */
controller.editAnnouncement = function(req, res, next) {
  logger.debug('editAnnouncement controller', logFn(req, null, null));
  logger.info('editAnnouncement controller', logFn(req, null, null));
  let announcementId = req.params.announcement_id;
  let announcementsObj = req.body;
  let editAnnouncementPromise = Announcements.updateAnnouncement(announcementId, announcementsObj);
  let response;
  editAnnouncementPromise.then(function(addResult) {
    if (addResult.code === 200) {
      response = responseStore.get(200);
      response.message = "Announcement/Task edited successfully.";
      res.finalResponse = response;
      res.finalMessage = "editAnnouncement Successful";
      next();
    } else {
      response = responseStore.get(500);
      res.finalResponse = response;
      res.finalMessage = "editAnnouncement editAnnouncementPromise failed";
      next();
    }
  }, function(error) {
    res.error = error;
    res.finalResponse = response;
    res.finalMessage = "editAnnouncement editAnnouncementPromise failed";
    next();
  });
}

/**
 *  Delete a announcement added by the user
 *  @param {object}  req - request object.
 *  @param {object}  res - response object.
 *  @return {object}
 */
controller.deleteAnnouncement = function(req, res, next) {
  logger.debug('deleteAnnouncement controller', logFn(req, null, null));
  logger.info('deleteAnnouncement controller', logFn(req, null, null));
  let announcementId = req.params.announcement_id ? [req.params.announcement_id] : [];
  let announcementsObj = req.body;
  let deleteAnnouncementPromise = Announcements.deleteAnnouncements(announcementId);
  let response;
  deleteAnnouncementPromise.then(function(addResult) {
    if (addResult.code === 200) {
      response = responseStore.get(200);
      response.message = "Announcement/Task deleted successfully.";
      res.finalResponse = response;
      res.finalMessage = "deleteAnnouncement Successful";
      next();
    } else {
      response = responseStore.get(500);
      res.finalResponse = response;
      res.finalMessage = "deleteAnnouncement deleteAnnouncementPromise failed";
      next();
    }
  }, function(error) {
    res.error = error;
    res.finalResponse = response;
    res.finalMessage = "deleteAnnouncement deleteAnnouncementPromise failed";
    next();
  });
}

/**
 *  Get a announcement by its id
 *  @param {object}  req - request object.
 *  @param {object}  res - response object.
 *  @return {object}
 */
controller.getAnnouncement = function(req, res, next) {
  logger.debug('getAnnouncement controller', logFn(req, null, null));
  logger.info('getAnnouncement controller', logFn(req, null, null));
  let announcementId = req.params.announcement_id ? [req.params.announcement_id] : [];
  let getAnnouncementPromise = Announcements.getAnnouncementsByIds(announcementId);
  let response;
  getAnnouncementPromise.then(function(announcementsResult) {
    if (announcementsResult.code === 200) {
      if (announcementsResult.data.length > 0) {
        response = responseStore.get(200);
        response.data = announcementsResult.data[0];
        response.message = "Fetching Announcements/Task successfull.";
        res.finalResponse = response;
        res.finalMessage = "getAnnouncement Successful";
        next();
      } else {
        response = responseStore.get(404);
        response.message = "No Announcement/Task Found";
        res.finalResponse = response;
        res.finalMessage = "getAnnouncement Not Found Error";
        next();
      }
    } else {
      response = responseStore.get(500);
      res.finalResponse = response;
      res.finalMessage = "getAnnouncement getAnnouncementPromise failed";
      next();
    }
  }, function(error) {
    res.error = error;
    response = responseStore.get(500);
    res.finalResponse = response;
    res.finalMessage = "getAnnouncement getAnnouncementPromise failed";
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
