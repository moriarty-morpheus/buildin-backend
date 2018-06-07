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
/**
 * Authentication controller
 */
const controller = {};

controller.register = function(req, res, next) {
    console.log(req.body,"=================1")
    let userNamePromise = Users.checkUserName(req.body);
    let emailPromise = Users.checkEmail(req.body);
    let response;
    Q.all([userNamePromise, emailPromise]).then(function(validations) {
        if (validations[0].code === 200 || validations[1].code === 200) {
            response = responseStore.get(409);
            if (validations[0].code !== 200) {
                response.message = 'Oops! This Email Already Exists';
                return res.status(409).send(response);
            } else if (validations[1].code !== 200) {
                response.message = 'Oops! This Username Already Exists';
                return res.status(409).send(response);
            } else {
                response.message = 'Oops! This Username and Email Already Exist';
                return res.status(409).send(response);
            }
        } else {
            if (_.keys(req.body).indexOf("is_admin")) {
                req.body.is_admin = req.body.is_admin === true ? true : false;
            } else {
                req.body.is_admin = false;
            }
            req.body.is_approved = false;
            req.body.is_active = false;
            let createUserPromise = Users.createUser(req.body);
            createUserPromise.then(function(result) {
                let emailPromises = [
                    helper.sendEmailToAdmin(req, res, null, req.body.user_name),
                    helper.sendEmailToUser(req, res, req.body.email, req.body.user_name)
                ];
                Q.all(emailPromises).then(function(results) {
                    response = responseStore.get(201);
                    response.message = 'Hey! Your Account Is Created Successfully';
                    return res.status(201).send(response);
                }, function(error) {
                    response = responseStore.get(500);
                    response.error = error;
                    return res.status(500).send(response);
                })
            }, function(error) {
                response = responseStore.get(500);
                response.error = error;
                return res.status(500).send(response);
            });
        }
    }, function(error) {
        response = responseStore.get(500);
        response.error = error;
        return res.status(500).send(response);
    });
}

controller.login = function(req, res, next) {
    let response;
    try {
        let userNamePromise = Users.checkUserName(req.body);
        userNamePromise.then(function(userNameResult) {
            if (userNameResult.code === 200) {
                let getUserPromise = Users.getUserByUsernamePassword(req.body);
                getUserPromise.then(function(result) {
                    if (result.code === 200) {
                        if (result.data.is_approved && result.data.is_active) {
                            let accessTokenObj = helper.createTokenObj(req, res, result.data);
                            let createTokenPromise = Sessions.createToken(accessTokenObj);
                            createTokenPromise.then(function(tokenResult) {
                                response = responseStore.get(200);
                                response.data = _.omit(accessTokenObj, ["hashed_passowrd", "email", "contact_number"]);
                                return res.status(200).send(response);
                            }, function(error) {
                                response = responseStore.get(500);
                                response.error = error;
                                return res.status(500).send(response);
                            })
                        } else {
                            response = responseStore.get(403);
                            response.message = 'Your account approval is pending. Please contact our admin at admin@help.com';
                            return res.status(403).send(response);
                        }
                    } else {
                        response = responseStore.get(401);
                        response.message = 'Incorrect username and/or password. Please check your credentials and try again';
                        return res.status(401).send(response);
                    }
                }, function(error) {
                    response = responseStore.get(500);
                    response.error = error;
                    return res.status(500).send(response);
                });
            } else {
                response = responseStore.get(401);
                response.message = 'Incorrect username and/or password. Please check your credentials and try again';
                return res.status(401).send(response);
            }
        }, function(error) {
            response = responseStore.get(500);
            response.error = error;
            return res.status(500).send(response);
        });        
    } catch (error) {
        console.log(error);
        response = responseStore.get(500);
        response.error = error;
        return res.status(500).send(response);
    }
}


controller.logout = function(req, res, next) {
    let response;
    try{
        let deleteSessionPromise = Sessions.deleteAccessToken(req.user);
        deleteSessionPromise.then(function(deleteSessionResult) {
            if (deleteSessionResult.code === 200) {
                response = responseStore.get(200);
                response.message = "Logout Successful"
                return res.status(200).send(response);
            } else {
                response = responseStore.get(500);
                return res.status(500).send(response);
            }
        }, function(error) {
            response = responseStore.get(500);
            response.error = error;
            return res.status(500).send(response);
        });        
    } catch (error) {
        console.log(error)
        response = responseStore.get(500);
        response.error = error;
        return res.status(500).send(response);        
    }
}

module.exports = controller;
