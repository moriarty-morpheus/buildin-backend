/*jshint node: true*/
'use strict';

/**
 * Import porject modules
 */
const Q = require('q');
const responseStore = require('../../dbStore').responseStore;
const uuid = require('uuid');
/**
 * Creating PasswordTokens Object
 */
function PasswordTokens(version) {
    this.model = require('../models/' + version + '/passwordTokens').passwordTokensModel;

    this.addToken = function(tokenObj) {
        let deferred = Q.defer();
        try {
            if (!tokenObj.user_id) {
                let error = responseStore.get(422);
                error.msg = 'Invalid user_id';
                deferred.reject(error);
                return deferred.promise;
            }
            let updateQuery = {
              '$set': {
                password_token: uuid(),
                user_id: tokenObj.user_id,
                is_used: false,
                created_date: Date.now(),
                updated_date: null,
                deleted_date: null
              }
            }
            this.model.update(
              {'user_id':tokenObj.user_id},
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

    this.getTokenByUserId = function(tokenObj) {
        let deferred = Q.defer();

        try {
            if (!tokenObj.user_id) {
                let error = responseStore.get(422);
                error.msg = 'Invalid User Id';
                deferred.reject(error);
                return deferred.promise;
            }

            this.model.findOne({'user_id': tokenObj.user_id})
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
            if (!tokenObj.password_token) {
                let error = responseStore.get(422);
                error.msg = 'Invalid Password Token';
                deferred.reject(error);
                return deferred.promise;
            }

            this.model.findOne({'password_token': tokenObj.password_token})
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
          if (!tokenObj.user_id) {
              let error = responseStore.get(422);
              error.msg = 'Invalid user_id';
              deferred.reject(error);
              return deferred.promise;
          }
          let passwordToken = {
            user_id: tokenObj.user_id
          }
          this.model.update(
            {'user_id':passwordToken.user_id},
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
    PasswordTokens: PasswordTokens
}
