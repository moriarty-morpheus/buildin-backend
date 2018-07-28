/*jshint node: true */
"use strict";
/**
 * Import Required Node Modules
 */
require('dotenv').load();
/**
 * Import Required Project Modules
 */
const forgotPasswordLink = process.env.FORGOT_PASSWORD_LINK;
/**
 * Authentication constants
 */
const constants = {};

/**
 * Email messages
 */
constants.messages = {
	registerAdmin: {
		sub: "User Registered",
		msg: "Hi Admin, \n\t USER_NAME has just registered on our application and is waiting for your approval. \nPlease check and do the needful."
	},
	registerUser: {
		sub: "User Registered",
		msg: "Hi USER_NAME, \n\t Thanks for registering on our application. Your account approval is pending for approval. \n\tYou will receive an email on the account status. \nThank You!"
	},
  forgotPassword: {
    sub: "Forgot Password",
    msg: "Hi USER_NAME, \n\t To reset you password please click the below link. \n\t" + forgotPasswordLink+". \n\t"+
         "The Link expires in 24hrs. Please hurry up and reset your password."
  }
}

constants.defaultPermissions = [
  'v0_add_complaint', 'v0_edit_complaint', 'v0_delete_complaint',
  'v0_get_complaint', 'v0_get_user', 'v0_get_tabs'
];

constants.adminCode = "asdfghjkl";
module.exports = constants;
