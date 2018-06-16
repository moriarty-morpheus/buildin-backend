/*jshint node: true*/
'use strict';

/**
 * Import node modules
 */
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

/**
 * Schema constructor
 */
const Schema = mongoose.Schema;

/**
 * Root Schema
 */
const rootSchema = {
    created_date: {
        type: Date,
        default: Date.now
    },
    updated_date: {
        type: Date,
        default: null
    },
    deleted_date: {
        type: Date,
        default: null
    }
}

const getRootSchema = function() {
    const mongooseRootSchema = new mongoose.Schema(rootSchema);
    mongooseRootSchema.plugin(uniqueValidator);
    return mongooseRootSchema;
}

module.exports = {
  getRootSchema: getRootSchema
}
