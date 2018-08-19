/*jshint node: true*/
'use strict';

/**
 * Import porject modules
 */
const _ = require('underscore');
const Q = require('q');
const responseStore = require('../../dbStore').responseStore;
const uuid = require('uuid');
/**
 * Creating Announcements Object
 */
function Announcements(version) {
  this.model = require('../models/' + version + '/announcements').announcementsModel;

  this.createAnnouncement = function(announcementsObj) {
    let deferred = Q.defer();
    try {
      if (!announcementsObj.details) {
        let error = responseStore.get(422);
        error.msg = 'Invalid details';
        deferred.reject(error);
        return deferred.promise;
      }

      if (!announcementsObj.title) {
        let error = responseStore.get(422);
        error.msg = 'Invalid title';
        deferred.reject(error);
        return deferred.promise;
      }
      announcementsObj.announcement_id = uuid();
      let announcements = new this.model(announcementsObj);
      announcements.save(function(err) {
        if (err) {
          let response = responseStore.get(500);
          response.error = err;
          deferred.reject(response);
        } else {
          let response = responseStore.get(200);
          response.message = "Announcement Saved Successfully";
          deferred.resolve(response);
        }
      });
    } catch (error) {
      let response = responseStore.get(500);
      response.error = error;
      deferred.reject(response);
    }
    return deferred.promise;
  }

  this.getAllAnnouncements = function(filters) {
    let deferred = Q.defer();
    try {
      this.model.find({},
        {'_id': 0, '__v': 0})
      .then(function(announcementsList) {
        let response = responseStore.get(200);
        response.data = announcementsList;
        deferred.resolve(response);
      }, function(err) {
        let response = responseStore.get(500);
        response.error = err;
        deferred.reject(response);
      });
    } catch (error) {
      let response = responseStore.get(500);
      response.error = error;
      deferred.reject(response);
    }
    return deferred.promise;
  }

  this.updateAnnouncement = function(announcement_id, announcementObj) {
    let deferred = Q.defer();
    if (!announcement_id) {
      let error = responseStore.get(422);
      error.msg = 'Invalid announcement_id';
      deferred.reject(error);
      return deferred.promise;
    }

    try {
      this.model.update({"announcement_id": announcement_id},
        {"$set":announcementObj})
      .then(function(updateResult) {
        let response = responseStore.get(200);
        response.msg = "Update successful";
        deferred.resolve(response);
      }, function(err) {
        let response = responseStore.get(500);
        response.error = err;
        deferred.reject(response);
      });
    } catch (error) {
      let response = responseStore.get(500);
      response.error = error;
      deferred.reject(response);
    }
    return deferred.promise;
  }

  this.deleteAnnouncements = function(announcement_ids) {
    let deferred = Q.defer();
    if (!announcement_ids) {
      let error = responseStore.get(422);
      error.msg = 'Invalid announcement_ids';
      deferred.reject(error);
      return deferred.promise;
    }
    try {
      this.model.remove({"announcement_id": {"$in": announcement_ids}})
      .then(function(removeResult) {
        let response = responseStore.get(200);
        response.msg = "Delete successful";
        deferred.resolve(response);
      }, function(err) {
        let response = responseStore.get(500);
        response.error = err;
        deferred.reject(response);
      });
    } catch (error) {
      let response = responseStore.get(500);
      response.error = error;
      deferred.reject(response);
    }
    return deferred.promise;
  }

  this.getAnnouncementsByIds = function(announcement_ids) {
    let deferred = Q.defer();
    try {
      if (!announcement_ids || (announcement_ids && announcement_ids.length === 0)) {
        let error = responseStore.get(422);
        error.msg = 'Invalid announcement_ids';
        deferred.reject(error);
        return deferred.promise;
      }
      this.model.find({"announcement_id":{"$in":announcement_ids}},
        {'_id': 0, '__v': 0})
      .then(function(announcementsList) {
        let response = responseStore.get(200);
        response.data = announcementsList;
        deferred.resolve(response);
      }, function(err) {
        let response = responseStore.get(500);
        response.error = err;
        deferred.reject(response);
      });
    } catch (error) {
      let response = responseStore.get(500);
      response.error = error;
      deferred.reject(response);
    }
    return deferred.promise;
  }
};

module.exports = {
  Announcements: Announcements
}
