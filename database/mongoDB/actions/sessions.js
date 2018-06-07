/*jshint node: true*/
'use strict';

/**
 * Import porject modules
 */
const Q = require('q');
const responseStore = require('../../dbStore').responseStore;
const uuid = require('uuid');
/**
 * Creating Sessions Object
 */
function Sessions(version) {
    this.model = require('../models/' + version + '/sessions').sessionsModel;

    this.createToken = function(sessionObj) {
        let deferred = Q.defer();
        try {
            if (!sessionObj.access_token) {
                let error = responseStore.get(422);
                error.msg = 'Invalid accessToken';
                deferred.reject(error);
                return deferred.promise;
            }

            if (!sessionObj.user_id) {
                let error = responseStore.get(422);
                error.msg = 'Invalid user_id';
                deferred.reject(error);
                return deferred.promise;
            }

            if (!sessionObj.condominium) {
                let error = responseStore.get(422);
                error.msg = 'Invalid Condominium';
                deferred.reject(error);
                return deferred.promise;
            }

            let session = new this.model(sessionObj);
            session.save(function(err) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve({'msg': 'success'})
                }
            });    
        } catch (error) {
            deferred.reject(error);
        }
        return deferred.promise;
    }

    this.getAccessToken = function(sessionObj) {
        let deferred = Q.defer();

        try {
            if (!sessionObj.access_token) {
                let error = responseStore.get(422);
                error.msg = 'Invalid accessToken';
                deferred.reject(error);
                return deferred.promise;
            }

            this.model.findOne({'access_token': sessionObj.access_token})
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
                let error = responseStore.get(500);
                error.msg = 'Mongo Server Error';
                deferred.reject(error);
            });            
        } catch (error) {
            deferred.reject(error);            
        }
        return deferred.promise;
    }

    this.deleteAccessToken = function(sessionObj) {
        let deferred = Q.defer();

        try {
            if (!sessionObj.access_token) {
                let error = responseStore.get(422);
                error.msg = 'Invalid accessToken';
                deferred.reject(error);
                return deferred.promise;
            }

            this.model.remove({'access_token': sessionObj.access_token})
            .then(function(result) {
                let response = responseStore.get(200);
                response.message = "Token deleted successfuly";
                deferred.resolve(response);
            }, function(err) {
                let error = responseStore.get(500);
                error.msg = 'Mongo Server Error';
                deferred.reject(error);
            });            
        } catch (error) {
            deferred.reject(error);            
        }
        return deferred.promise;
    }

};

module.exports = {
    Sessions: Sessions
}
