/*jshint node: true */
"use strict";
/**
 * Dashboard constants
 */
const constants = {};

/**
 * Fields in response
 */
constants.fieldsInResponse = {
	dashboard: {
		userList: ["first_name", "last_name", "user_id", "user_name", "is_active", "is_approved"]
	}
}

/**
 * List of tabs for different types of users
 */
constants.tabsList = {
  "admin": ["Users", "Complaints", "Account"],
  "user": ["My Complaints", "Account"]
}

module.exports = constants;
