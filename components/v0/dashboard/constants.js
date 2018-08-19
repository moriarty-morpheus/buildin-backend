/*jshint node: true */
"use strict";
/**
 * Dashboard constants
 */
const constants = {};
const invitationLink = process.env.INVITATION_LINK;

/**
 * Fields in response
 */
constants.fieldsInResponse = {
	dashboard: {
		userList: ["first_name", "last_name", "user_id", "user_name", "is_active", "is_approved"]
	}
}

/**
 * Email messages
 */
constants.messages = {
  invitation: {
    sub: "Registration Invitation",
    msg: "Congratulations , \n\t You are invited to register on our application. " +
         "Please click the below link for registration. \n\t" + invitationLink+". \n\t"+
         "Please hurry up and register."
  }
}

/**
 * List of tabs for different types of users
 */
constants.tabsList = {
  "admin": ["Users", "Complaints", "Account", "Invitations"],
  "user": ["My Complaints", "Account"]
}

module.exports = constants;
