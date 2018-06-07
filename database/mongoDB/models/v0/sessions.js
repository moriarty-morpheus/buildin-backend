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
 * Adding additional fields to sessionSchema
 */
const sessionSchema = rootSchema.getRootSchema();
sessionSchema.add({
    first_name: {type: String, match: /[a-zA-Z]+/, required: false},
    last_name: {type: String, match: /[a-zA-Z]+/, required: false},
    user_name: {type: String, match: /[a-zA-Z0-9]+/, required: true},
    access_token: {type: String, required: true},
    user_id: {type: String, required: true},
    permissions: {type: Array, required: false},
    roles: {type: Array, required: false},
    condominium: {type: Object, required: true},
    country: {type: String, required: false},
    city: {type: String, required: false},
    address: {type: String, required: false},
    profile_pic: {type: String, required: false},
    user_pic: {type: String, required: false},
    is_admin: {type: Boolean, required: true},
    is_active: {type: Boolean, required: true},
    expiry_time: {type: Number, required: true}
});

/**
 * Create Users Model
 */
const sessionsModel = mongoose.model(collections.sessions, sessionSchema);

module.exports = {
    sessionsModel: sessionsModel
}
