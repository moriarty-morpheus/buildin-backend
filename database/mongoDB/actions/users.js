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
 * Creating Users Object
 */
function Users(version) {
  this.model = require('../models/' + version + '/users').usersModel;

  this.createUser = function(userObj) {
    let deferred = Q.defer();
    try {
      if (!userObj.user_name) {
        let error = responseStore.get(422);
        error.msg = 'Invalid Username';
        deferred.reject(error);
        return deferred.promise;
      }

      if (!userObj.email) {
        let error = responseStore.get(422);
        error.msg = 'Invalid Email';
        deferred.reject(error);
        return deferred.promise;
      }

      if (!userObj.password) {
        let error = responseStore.get(422);
        error.msg = 'Invalid Password';
        deferred.reject(error);
        return deferred.promise;
      }

      if (!userObj.condominium) {
        let error = responseStore.get(422);
        error.msg = 'Invalid Condominium';
        deferred.reject(error);
        return deferred.promise;
      }

      // if (!userObj.contact_number) {
      //   let error = responseStore.get(422);
      //   error.msg = 'Invalid Contact Number';
      //   deferred.reject(error);
      //   return deferred.promise;
      // }

      userObj.user_id = uuid();
      let user = new this.model(userObj);
      user.save(function(err) {
        if (err) {
          let response = responseStore.get(500);
          response.error = err;
          deferred.reject(response);
        } else {
          let response = responseStore.get(200);
          response.message = "User Saved Successfully";
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

  this.checkUserName = function(userObj) {
    let deferred = Q.defer();
    try {
      if (!userObj.user_name) {
        let error = responseStore.get(422);
        error.msg = 'Invalid Username';
        deferred.reject(error);
        return deferred.promise;
      }
      this.model.findOne({'user_name': userObj.user_name}, {'_id': 0})
      .then(function(foundUser) {
        if (!foundUser) {
          let response = responseStore.get(404);
          deferred.resolve(response);
        } else {
          let response = responseStore.get(200);
          response.data = foundUser;
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

  this.checkEmail = function(userObj) {
    let deferred = Q.defer();

    try {
      if (!userObj.email) {
        let error = responseStore.get(422);
        error.msg = 'Invalid Email';
        deferred.reject(error);
        return deferred.promise;
      }

      this.model.findOne({'email': userObj.email}, {'_id': 0})
      .then(function(foundUser) {
        if (!foundUser) {
          let response = responseStore.get(404);
          deferred.resolve(response);
        } else {
          let response = responseStore.get(200);
          response.data = foundUser;
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

  this.getUserByUsernamePassword = function(userObj) {
    let deferred = Q.defer();

    try {
      if (!userObj.user_name) {
        let error = responseStore.get(422);
        error.msg = 'Invalid Username';
        deferred.reject(error);
        return deferred.promise;
      }

      if (!userObj.password) {
        let error = responseStore.get(422);
        error.msg = 'Invalid Username';
        deferred.reject(error);
        return deferred.promise;
      }

      this.model.findOne({'user_name': userObj.user_name,
        'hashed_password': this.model.encryptPassword(userObj.password)},
        {'_id': 0, 'hashedPassword': 0, '__v': 0})
      .then(function(foundUser) {
        if (!foundUser) {
          let response = responseStore.get(404);
          deferred.resolve(response);
        } else {
          let response = responseStore.get(200);
          response.data = foundUser;
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

  this.getAllUsers = function(filters) {
    let deferred = Q.defer();
    try {
      this.model.find({},
        {'_id': 0, 'hashed_password': 0, '__v': 0})
      .then(function(usersList) {
        let response = responseStore.get(200);
        response.data = usersList;
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

  this.updateUserApprovalStatus = function(user_id, approveStatus) {
    let deferred = Q.defer();
    if (!user_id) {
      let error = responseStore.get(422);
      error.msg = 'Invalid user_id';
      deferred.reject(error);
      return deferred.promise;
    }

    if (!_.isBoolean(approveStatus)) {
      let error = responseStore.get(422);
      error.msg = 'Invalid Approval Status';
      deferred.reject(error);
      return deferred.promise;
    }
    try {
      this.model.update({"user_id": user_id},
        {"$set":{"is_approved": approveStatus, "is_active": approveStatus}})
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

  this.updateUserActiveStatus = function(user_id, activeStatus) {
    let deferred = Q.defer();
    if (!user_id) {
      let error = responseStore.get(422);
      error.msg = 'Invalid user_id';
      deferred.reject(error);
      return deferred.promise;
    }

    if (!_.isBoolean(activeStatus)) {
      let error = responseStore.get(422);
      error.msg = 'Invalid Active Status';
      deferred.reject(error);
      return deferred.promise;
    }
    try {
      this.model.update({"user_id": user_id},
        {"$set":{"is_active": activeStatus}})
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

  this.updateUserPassword = function(user_id, password) {
    let deferred = Q.defer();
    if (!user_id) {
      let error = responseStore.get(422);
      error.msg = 'Invalid user_id';
      deferred.reject(error);
      return deferred.promise;
    }

    if (!password) {
      let error = responseStore.get(422);
      error.msg = 'Invalid password';
      deferred.reject(error);
      return deferred.promise;
    }

    try {
      this.model.findOne({"user_id": user_id})
      .then(function(foundResult) {
        foundResult.password = password;
        foundResult.save(function(err) {
          if (err) {
            let response = responseStore.get(500);
            response.error = err;
            deferred.reject(response);
          } else {
            let response = responseStore.get(200);
            response.message = "Update Password Successful";
            deferred.resolve(response);
          }
        });
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

  this.getUsersByIds = function(user_ids) {
    let deferred = Q.defer();
    try {
      if (!user_ids) {
        let error = responseStore.get(422);
        error.msg = 'Invalid User Ids';
        deferred.reject(error);
        return deferred.promise;
      }
      if (user_ids.length === 0) {
        let error = responseStore.get(422);
        error.msg = 'Invalid User Ids';
        deferred.reject(error);
        return deferred.promise;
      }
      this.model.find({"user_id":{"$in":user_ids}},
        {'_id': 0, 'hashed_password': 0, '__v': 0})
      .then(function(usersList) {
        let response = responseStore.get(200);
        response.data = usersList;
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

  this.setPermissions = function(user_id, userObj) {
    let deferred = Q.defer();
    if (!user_id) {
      let error = responseStore.get(422);
      error.msg = 'Invalid user_id';
      deferred.reject(error);
      return deferred.promise;
    }

    try {
      let setObj = {};
      if (userObj.permissions) {
        setObj.permissions = userObj.permissions;
      }
      if (userObj.is_active) {
        setObj.is_active = userObj.is_active;
      }
      if (userObj.is_approved) {
        setObj.is_approved = userObj.is_approved;
      }
      this.model.update({"user_id": user_id},
        {"$set": setObj})
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

};

module.exports = {
  Users: Users
}
