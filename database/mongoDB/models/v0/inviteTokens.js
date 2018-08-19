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

/**
 * Adding additional fields to inviteTokensSchema
 */
const inviteTokensSchema = rootSchema.getRootSchema();
inviteTokensSchema.add({
    invite_token: {type: String, required: true},
    email: {type: String, required: true},
    is_used: {type: Boolean, required: true}
});

/**
 * Create Users Model
 */
const inviteTokensModel = mongoose.model(collections.inviteTokens, inviteTokensSchema);

module.exports = {
    inviteTokensModel: inviteTokensModel
}
