/*jshint node: true */
"use strict";
/**
 * Import Required Node Modules
 */
require('dotenv').load();
/**
 * Import Required Project Modules
 */
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

/**
 *  Send email to the user and admin when the user registers
 *  @param {object}  req - request object.
 *  @param {object}  res - response object.
 *  @param {string}  userEmail - email of the user.
 *  @param {string}  userName - name of the user.
 *  @return {object}
 */
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

/**
 *  Send forgot password link to a user
 *  @param {object}  req - request object.
 *  @param {object}  res - response object.
 *  @param {string}  userEmail - email of the user.
 *  @param {string}  userName - name of the user.
 *  @param {string}  token - forgot password token.
 *  @return {object}
 */
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

/**
 *  create jwt token for a logged in user
 *  @param {object}  req - request object.
 *  @param {object}  res - response object.
 *  @param {object}  userObj - user object.
 *  @return {object}
 */
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
