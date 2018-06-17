/*jshint node: true*/
'use strict';
const _ = require('underscore');
const validator = {
  required: function(value) {
    if (value && typeof(value) === 'string') {
      value = value.trim();
    }
    if (value === "" || value === undefined || value === null || value === NaN) {
      return false;
    } else {
      return true;
    }
  },
  notRequired: function(value) {
    if (value) {
      value = value.trim();
    }
    if (value === "" || value === undefined || value === null || value === NaN) {
      return true;
    } else {
      return false;
    }
  },
  isStrongPassword: function (value) {
    let regExp = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    return regExp.test(value);
  },
  isEmail: function(value) {
    let emailRegEx = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegEx.test(value);
  }
};

module.exports = validator;
