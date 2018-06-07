/*jshint node: true */
"use strict";
/**
 * Import Required Node Modules
 */
const Q = require('q');
/**
 * Import Required Project Modules
 */
const actionsStore = require('../../../database/store').actionsStore;
const responseStore = require('../../utility/store').responseStore;
const _ = require('underscore');
const helper = require('./helper');
const Users = new actionsStore.Users('v0');
const Sessions = new actionsStore.Sessions('v0');
const constants = require('./constants');
/**
 * Authentication controller
 */
const controller = {};

controller.getUsersList = function(req, res, next) {
    let usersListPromise = Users.getAllUsers({});
    let response;
    usersListPromise.then(function(usersListResult) {
        if (usersListResult.code === 200) {
            if (usersListResult.data.length > 0) {
                for (let k = 0; k < usersListResult.data.length; k++) {
                    _.pick(usersListResult.data[k], constants.fieldsInResponse.dashboard.usersList);
                }
                response = responseStore.get(200);
                response.data = usersListResult.data;
                return res.status(200).send(response);                
            } else {                
                response = responseStore.get(200);
                response.data = [];
                return res.status(200).send(response);                
            }
        } else {
            response = responseStore.get(500);
            return res.status(500).send(response);
        }
    }, function(error) {
        return res.status(500).send(error);
    });
}

controller.updateApprovalStatus = function(req, res, next) {
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
                                + "Hurry up and check in.";
                } else {
                    msg = "Hi " + user.user_name +",\n\tYour account has been rejected by our admin for the following reason.\n\t" +
                                + updateObjectsArray[k].reason;
                }
                updateStatusPromises.push(helper.sendApprovalStatusEmailToUser(
                    req, res, user.email, msg
                ));
            }
        }
        Q.all(updateStatusPromises).then(function(results) {
            console.log("=========0", results)
            if (results) {
                response = responseStore.get(201);
                response.message = "Status Updated Successfully";
                return res.status(201).send(response);
            } else {
                response = responseStore.get(500);
                return res.status(500).send(response);
            }
        }, function(error) {
            return res.status(500).send(error);
        });
    }, function(error) {
        response = responseStore.get(500);
        response.msg = "Internal Server Error";
        return res.status(500).send(response);        
    });

}

module.exports = controller;
