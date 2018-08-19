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
const constants = require('./constants');
const FROM_EMAIL = gmailConfig.from_email_id;
const MESSAGES = require('./constants').messages;
const Q = require('q');
const _ = require('underscore');

/**
 * Authentication helper
 */
const helper = {};

helper.sendApprovalStatusEmailToUser = function(req, res, user_email, body) {
	let deferred = Q.defer();
	let mailPromise = gmail.sendEmail(
		user_email, gmailConfig.from_email_id,
		"Account Approval Status",
		body
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
 *  Send forgot password link to a user
 *  @param {object}  req - request object.
 *  @param {object}  res - response object.
 *  @param {string}  userEmail - email of the user.
 *  @param {string}  token - forgot password token.
 *  @return {object}
 */
helper.sendInvitationEmail = function(req, res, userEmail, token) {
  console.log(token,'----------abcd');
  let deferred = Q.defer();
  let body = MESSAGES.invitation.msg;
  body = body.replace('TOKEN', token);
  console.log(userEmail, FROM_EMAIL, MESSAGES.invitation.sub, body,'---------------');
  let mailPromise = gmail.sendEmail(
		userEmail, FROM_EMAIL, MESSAGES.invitation.sub, body
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

module.exports = helper;
