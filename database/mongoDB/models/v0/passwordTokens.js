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
 * Adding additional fields to passwordTokensSchema
 */
const passwordTokensSchema = rootSchema.getRootSchema();
passwordTokensSchema.add({
    password_token: {type: String, required: true},
    user_id: {type: String, required: true},
    is_used: {type: Boolean, required: true}
});

/**
 * Create Users Model
 */
const passwordTokensModel = mongoose.model(collections.passwordTokens, passwordTokensSchema);

module.exports = {
    passwordTokensModel: passwordTokensModel
}
