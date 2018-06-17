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
    if (value.length < 6) {
      return false;
    }
    if (!value.match(/[0-9]/g)) {
      return false;
    }
    if (!value.match(/[!@#\$%\^\&*\)\(+=._-]/g)) {
      return false;
    }
    return true;
  },
  isEmail: function(value) {
    let emailRegEx = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegEx.test(value);
  }
};

module.exports = validator;
