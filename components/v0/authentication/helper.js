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
const jwt = require('jsonwebtoken');
const _ = require('underscore');
/**
 * Authentication helper
 */
const helper = {};

helper.sendEmailToAdmin = function(req, res, admin, user_name) {
	let deferred = Q.defer();
	let mailPromise = gmail.sendEmail(
		gmailConfig.admin_id, gmailConfig.from_email_id,
		constants.messages.register_admin.sub,
		constants.messages.register_admin.msg.replace('USER_NAME',user_name)
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

helper.sendEmailToUser = function(req, res, user_email, user_name) {
	let deferred = Q.defer();
	let mailPromise = gmail.sendEmail(
		user_email, gmailConfig.from_email_id,
		constants.messages.register_user.sub,
		constants.messages.register_user.msg.replace('USER_NAME',user_name)
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