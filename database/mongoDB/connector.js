/*jshint node: true*/
'use strict';

/**
 * Import node modules
 */
const mongoose = require('mongoose');
const config = require('config');
require('dotenv').load();
const dbEnv = process.env.MONGO_ENV;
const version = process.env.MONGO_VERSION;
const url = require('config').get('mongoConfig').connections[dbEnv][version];
mongoose.connect(url, {
  useMongoClient: true,
  autoIndex: false
});
