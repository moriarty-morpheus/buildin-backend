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
 * Creating Complaints Object
 */
function Complaints(version) {
  this.model = require('../models/' + version + '/complaints').complaintsModel;

  this.createComplaint = function(complaintsObj) {
    let deferred = Q.defer();
    try {
      if (!complaintsObj.user_id) {
        let error = responseStore.get(422);
        error.msg = 'Invalid user_id';
        deferred.reject(error);
        return deferred.promise;
      }

      if (!complaintsObj.details) {
        let error = responseStore.get(422);
        error.msg = 'Invalid details';
        deferred.reject(error);
        return deferred.promise;
      }

      if (!complaintsObj.location) {
        let error = responseStore.get(422);
        error.msg = 'Invalid location';
        deferred.reject(error);
        return deferred.promise;
      }
      complaintsObj.complaint_id = uuid();
      let complaints = new this.model(complaintsObj);
      complaints.save(function(err) {
        if (err) {
          let response = responseStore.get(500);
          response.error = err;
          deferred.reject(response);
        } else {
          let response = responseStore.get(200);
          response.message = "Complaint Saved Successfully";
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

  this.getComplaintsByUserIds = function(userIds, filters) {
    let deferred = Q.defer();

    try {
      if (!userIds) {
        let error = responseStore.get(422);
        error.msg = 'Invalid userIds';
        deferred.reject(error);
        return deferred.promise;
      }

      this.model.find({'user_id': {"$in":userIds}},
        {'_id': 0, '__v': 0})
      .then(function(foundComplaints) {
        if (!foundComplaints) {
          let response = responseStore.get(404);
          deferred.resolve(response);
        } else {
          let response = responseStore.get(200);
          response.data = foundComplaints;
          deferred.resolve(response);
        }
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

  this.getAllComplaints = function(filters) {
    let deferred = Q.defer();
    try {
      this.model.find({},
        {'_id': 0, '__v': 0})
      .then(function(complaintsList) {
        let response = responseStore.get(200);
        response.data = complaintsList;
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

  this.updateAComplaint = function(complaint_id, complaintObj) {
    let deferred = Q.defer();
    if (!complaint_id) {
      let error = responseStore.get(422);
      error.msg = 'Invalid complaint_id';
      deferred.reject(error);
      return deferred.promise;
    }

    try {
      this.model.update({"complaint_id": complaint_id},
        {"$set":complaintObj})
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

  this.deleteComplaints = function(complaint_ids) {
    let deferred = Q.defer();
    if (!complaint_ids) {
      let error = responseStore.get(422);
      error.msg = 'Invalid complaint_ids';
      deferred.reject(error);
      return deferred.promise;
    }
    try {
      this.model.remove({"complaint_id": {"$in": complaint_ids}})
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

  this.getComplaintsByIds = function(complaint_ids) {
    let deferred = Q.defer();
    try {
      if (!complaint_ids || (complaint_ids && complaint_ids.length === 0)) {
        let error = responseStore.get(422);
        error.msg = 'Invalid complaint_ids';
        deferred.reject(error);
        return deferred.promise;
      }
      this.model.find({"complaint_id":{"$in":complaint_ids}},
        {'_id': 0, '__v': 0})
      .then(function(complaintsList) {
        let response = responseStore.get(200);
        response.data = complaintsList;
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
  Complaints: Complaints
}
