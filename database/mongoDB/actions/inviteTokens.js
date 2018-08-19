/*jshint node: true*/
'use strict';

/**
 * Import porject modules
 */
const Q = require('q');
const responseStore = require('../../dbStore').responseStore;
const uuid = require('uuid');
/**
 * Creating InviteTokens Object
 */
function InviteTokens(version) {
    this.model = require('../models/' + version + '/inviteTokens').inviteTokensModel;

    this.addToken = function(tokenObj) {
        let deferred = Q.defer();
        try {
            if (!tokenObj.email) {
                let error = responseStore.get(422);
                error.msg = 'Invalid email';
                deferred.reject(error);
                return deferred.promise;
            }
            let updateQuery = {
              '$set': {
                invite_token: uuid(),
                user_id: tokenObj.email,
                is_used: false,
                created_date: Date.now(),
                updated_date: null,
                deleted_date: null
              }
            }
            this.model.update(
              {'email':tokenObj.email},
              updateQuery,
              {upsert: true}
            ).then(function(updateResult) {
              let response = responseStore.get(201);
              response.data = updateQuery["$set"];
              deferred.resolve(response);
            }, function(error) {
              let response = responseStore.get(500);
              response.error = error;
              deferred.reject(response);
            });
        } catch (error) {
          let response = responseStore.get(500);
          response.error = error;
          deferred.reject(response);
        }
        return deferred.promise;
    }

    this.getTokenByEmail = function(tokenObj) {
        let deferred = Q.defer();

        try {
            if (!tokenObj.email) {
                let error = responseStore.get(422);
                error.msg = 'Invalid Email';
                deferred.reject(error);
                return deferred.promise;
            }

            this.model.findOne({'email': tokenObj.email})
            .then(function(foundToken) {
                if (!foundToken) {
                    let response = responseStore.get(404);
                    deferred.resolve(response);
                } else {
                    let response = responseStore.get(200);
                    response.data = foundToken;
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

    this.getToken = function(tokenObj) {
        let deferred = Q.defer();

        try {
            if (!tokenObj.invite_token) {
                let error = responseStore.get(422);
                error.msg = 'Invalid Invite Token';
                deferred.reject(error);
                return deferred.promise;
            }

            this.model.findOne({'invite_token': tokenObj.invite_token})
            .then(function(foundToken) {
                if (!foundToken) {
                    let response = responseStore.get(404);
                    deferred.resolve(response);
                } else {
                    let response = responseStore.get(200);
                    response.data = foundToken;
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

    this.setTokenStatus = function(tokenObj) {
      try {
          if (!tokenObj.email) {
              let error = responseStore.get(422);
              error.msg = 'Invalid email';
              deferred.reject(error);
              return deferred.promise;
          }
          let inviteToken = {
            email: tokenObj.email
          }
          this.model.update(
            {'email':inviteToken.email},
            {'$set': {is_used: true, updated_date: Date.now}}
          ).then(function(err, updateResult) {
            if (err) {
              let response = responseStore.get(500);
              response.error = err;
              deferred.reject(response);
            } else {
              let response = responseStore.get(201);
              response.data = updateResult;
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
};

module.exports = {
    InviteTokens: InviteTokens
}
