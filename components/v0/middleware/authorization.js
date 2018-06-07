
/*jshint node: true */
"use strict";
/**
 * Import Required Node Modules
 */
const _ = require('underscore');
/**
 * Import Required Project Modules
 */
const permissions = require('../../utility/permissions');
const responseStore = require('../../utility/store').responseStore;

/**
 * Authorization Module
 */
const authorization = {};
authorization.isAuthorized = function(req, res, next) {
	if (_.difference(permissions[req.permission_id],req.user.permissions).length > 0) {
		let response = responseStore.get(403);
		return res.status(403).send(response);
	} else {
		next();
	}
}

module.exports = authorization;