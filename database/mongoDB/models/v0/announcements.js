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
  "Open", "Reopened", "Closed", "Withdraw"
];
const adminStatusList = [
  "Accepted", "Rejected", "Pending", "Resolved", "In Progress", "Withdrawn"
];

/**
 * Adding additional fields to announcementsSchema
 */
const announcementsSchema = rootSchema.getRootSchema();
announcementsSchema.add({
  announcement_id: {type: String, required: true},
  title: {type: String, required: true},
  details: {type: String, required: true},
  attachments: {type: Array, required: false},
  last_admin_update: {type: Object, required: false}
});

/**
 * Create Users Model
 */
const announcementsModel = mongoose.model(collections.announcements, announcementsSchema);

module.exports = {
  announcementsModel: announcementsModel
}
