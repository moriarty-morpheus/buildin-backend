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
const Q = require('q');
const _ = require('underscore');
/**
 * Authentication helper
 */
const helper = {};

helper.sendApprovalStatusEmailToUser = function(req, res, user_email, body) {
	console.log('---------------1234', user_email, body)
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

module.exports = helper;