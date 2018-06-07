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
 * Adding additional fields to userSchema
 */
const userSchema = rootSchema.getRootSchema();
userSchema.add({
    first_name: {type: String, match: /[a-zA-Z]+/, required: false},
    last_name: {type: String, match: /[a-zA-Z]+/, required: false},
    user_name: {type: String, match: /[a-zA-Z0-9]+/, required: true},
    email: {
        type: String,
        match: /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
        required: true
    },
    hashed_password: {type: String, required: true},
    contact_number: {type: String, required: false},
    condominium: {type: Object, required: true},
    country: {type: String, required: false},
    city: {type: String, required: false},
    address: {type: String, required: false},
    profile_pic: {type: String, required: false},
    user_pic: {type: String, required: false},
    is_admin: {type: Boolean, required: true},
    is_approved: {type: Boolean, required: true},
    is_active: {type: Boolean, required: true},
    user_id: {type: String, required: true},
    permissions: {type: Array, required: false},
    roles: {type: Array, required: false}

});

/**
 * Adding required setters and getters to the model
 */
userSchema.virtual('password')
    .set(function(password) {
        this._plain_password = password;
        this.hashed_password = this.encryptPassword(password);
    })
    .get(function() {
      return this._plain_password;
    });

userSchema.methods.encryptPassword = function(password) {
    return crypter.encryptString(password);
}

userSchema.methods.verifyPassword = function(password) {
    return password === crypter.decryptString(this.hashed_password) ? true : false;
}
/**
 * Adding methods to userSchema
 */

userSchema.statics.encryptPassword = function(password) {
    return crypter.encryptString(password);
}

userSchema.statics.verifyPassword = function(password) {
    return password === crypter.decryptString(this.hashed_password) ? true : false;
}

/**
 * Create Users Model
 */
const usersModel = mongoose.model(collections.users, userSchema);

module.exports = {
    usersModel: usersModel
}
