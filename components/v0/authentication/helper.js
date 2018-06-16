/*jshint node: true */
"use strict";
/**
 * Import Required Node Modules
 */
require('dotenv').load();
/**
 * Import Required Project Modules
 */
const actionsStore = require('../../../database/store').actionsStore;
const responseStore = require('../../utility/store').responseStore;
const Users = new actionsStore.Users('v0');
const gmail = require('../../utility/gmail');
const gmailConfig = require('config').get('gmailConfig');
const FROM_EMAIL = gmailConfig.from_email_id;
const constants = require('./constants');
const MESSAGES = require('./constants').messages;
const Q = require('q');
const jwt = require('jsonwebtoken');
const _ = require('underscore');
/**
 * Authentication helper
 */
const helper = {};

helper.sendRegiterEmails = function(req, res, userEmail, userName) {
	let deferred = Q.defer();
  let mailPromises = [];
  mailPromises.push(gmail.sendEmail(
		gmailConfig.admin_id, FROM_EMAIL,
		MESSAGES.registerAdmin.sub,
		MESSAGES.registerAdmin.msg.replace('USER_NAME', userName)
	));
  mailPromises.push(gmail.sendEmail(
    userEmail, FROM_EMAIL,
    MESSAGES.registerUser.sub,
    MESSAGES.registerUser.msg.replace('USER_NAME', userName)
  ));
	Q.all(mailPromises).then(function(results) {
		if (results[0].status === 200 && results[1].status === 200) {
			deferred.resolve(results)
		} else {
			deferred.reject(results);
		}
	}, function(error) {
		deferred.reject(error);
	});
	return deferred.promise;
}

helper.sendForgotPasswordEmail = function(req, res, userEmail, userName, token) {
  let deferred = Q.defer();
  let body = MESSAGES.forgotPassword.msg;
  body = body.replace('USER_NAME', userName);
  body = body.replace('TOKEN', token);
  let mailPromise = gmail.sendEmail(
		userEmail, FROM_EMAIL, MESSAGES.forgotPassword.sub, body
	);
	mailPromise.then(function(result) {
		if (result.status === 200) {
			deferred.resolve(result)
		} else {
			deferred.reject(result);
		}
	}, function(error) {
		deferred.reject(error);
	});
	return deferred.promise;
}

helper.createTokenObj = function(req, res, userObj) {
	let token = jwt.sign(req.body, 'unoprojecto');
	let accessTokenObj = {
		'access_token': token,
		'expiry_time': (new Date()).getTime() + 86400000
	}
	_.extend(accessTokenObj, JSON.parse(JSON.stringify(userObj)));
	return accessTokenObj;
}

module.exports = helper;
