/*jshint node: true*/
'use strict';

/**
 * Import node modules
 */
const crypto = require('crypto');

/**
 * constants
 */
const cryptoPassword = 'c0n43rth3world'
/**
 * Encrypting Function
 */
const encryptString = function(plainText) {
  let cipher = crypto.createCipher('aes192', cryptoPassword);
  let encrypted = cipher.update(plainText, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

const decryptString = function(cryptedText) {
  let decipher = crypto.createDecipher('aes192', cryptoPassword);
  let decrypted = decipher.update(cryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

module.exports = {
  encryptString: encryptString,
  decryptString: decryptString
}
