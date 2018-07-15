/*jshint node: true */
"use strict";
/**
 * Complaints constants
 */
const constants = {};

/**
 * Fields in response
 */
constants.fieldsInResponse = {
	adminList: ["name", "user_id", "status", "status_by_admin", "complaint_id", "title", "created_date"],
  userList: ["user_id", "status", "status_by_admin", "complaint_id", "title", "created_date"]
}

module.exports = constants;
