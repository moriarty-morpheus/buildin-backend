/*jshint node: true*/
'use strict';

/**
 * Import node modules
 */
const mongoose = require('mongoose');

/**
 * Import porject modules
 */
const crypter = require('../../../../components/utility/crypter');
const rootSchema = require('./rootSchema');
const config = require('config');
const collections = config.get('mongoConfig').collections;
const userStatusList = [
  "Open", "Reopened", "Closed"
];
const adminStatusList = [
  "Accepted", "Rejected", "Pending", "Resolved", "In Progress"
];

/**
 * Adding additional fields to complaintsSchema
 */
const complaintsSchema = rootSchema.getRootSchema();
complaintsSchema.add({
  user_id: {type: String, required: true},
  name: {type: String, match: /[a-zA-Z]+/, required: true},
  complaint_id: {type: String, required: true},
  title: {type: String, required: true},
  location: {type: Object, required: false},
  details: {type: String, required: true},
  attachments: {type: Array, required: false},
  attachments_by_admin: {type: Array, required: false},
  status: {type: String, required: true, enum: userStatusList, default: "Open"},
  status_by_admin: {type: String, required: true, enum: adminStatusList, default: "Pending"},
  chats: {type: Array, required: false},
  last_admin_update: {type: Object, required: false}
});

/**
 * Create Users Model
 */
const complaintsModel = mongoose.model(collections.complaints, complaintsSchema);

module.exports = {
  complaintsModel: complaintsModel
}
