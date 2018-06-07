/*jshint node: true*/
'use strict';
/**
 *  Logger Module
 */

/**
  import npm modules
*/
const winston = require('winston');
winston.emitErrs = true;
let debug = new winston.Logger({
    levels: {
        debug: 0
    },
    transports: [
        new winston.transports.DailyRotateFile({
            level: 'debug',
            filename: 'debug.log',
            maxsize: 5242880,
            dirname: __dirname + '/../../logs',
            colorize: true,
            handleExceptions: true
        }),
        new winston.transports.Console ({
            level: 'debug',
            colorize: true,
            handleExceptions: true,
            timestamp: true
        })
    ],
    exitOnError: false
});

let info = new winston.Logger({
    levels: {
        info: 1
    },
    transports: [
        new winston.transports.DailyRotateFile({
            level: 'info',
            filename: 'info.log',
            maxsize: 5242880,
            dirname: __dirname + '/../../logs',
            colorize: true,
            handleExceptions: true,
            timestamp: true
        }),
        new winston.transports.Console({
            level: 'info',
            colorize: true,
            handleExceptions: true,
            timestamp: true,
        })
    ],
    exitOnError: false
});

let warn = new winston.Logger({
    levels: {
        warn: 2
    },
    transports: [
        new winston.transports.DailyRotateFile({
            level: 'warn',
            filename: 'warn.log',
            maxsize: 5242880,
            dirname: __dirname + '/../../logs',
            colorize: true,
            handleExceptions: true,
            timestamp: true
        }),
        new winston.transports.Console({
            level: 'warn',
            colorize: true,
            handleExceptions: true,
            timestamp: true
        })
    ],
    exitOnError: false
});

let error = new winston.Logger({
    levels: {
        error: 3
    },
    transports: [
        new winston.transports.DailyRotateFile({
            level: 'error',
            filename: 'error.log',
            maxsize: 5242880,
            dirname: __dirname + '/../../logs',
            colorize: true,
            handleExceptions: true
        }),
        new winston.transports.Console({
            level: 'error',
            colorize: true,
            handleExceptions: true
        })
    ],
    exitOnError: false
});

let logger = {
    debug: function(msg, param, object) {
        if(param && object){
           debug.debug(msg, param, object);
            return;
        }
        if(param){
            debug.debug(msg, param);
            return;
        }
        debug.debug(msg);
    },
    info: function(msg, param, object) {
        if(param && object){
            info.info(msg, param, object);
            return;
        }
        if(param){
            info.info(msg, param);
            return;
        }
        info.info(msg);
    },
    warn: function(msg, param, object) {
        if(param && object){
            warn.warn(msg, param, object);
            return;
        }
        if(param){
            warn.warn(msg, param);
            return;
        }
        warn.warn(msg);
    },
    error: function(msg, param, object) {
        if(param && object){
            error.error(msg, param, object);
            return;
        }
        if(param){
            error.error(msg, param);
            return;
        }
        error.error(msg);
    },
    log: function(level, msg, param, object) {
        let lvl = exports[level];
        lvl(msg, param, object);
    },
    stream:{
        write: function(message){
            debug.debug(message);
        }
    }
};

let userLogObj = function userLogObj(
                        req, data, error) {
    let loggerObj = {};
    console.log(req.get('User-Agent'));
    loggerObj.user = {
        id: req.user.user_id,
        firstname: req.user.first_name,
        lastname: req.user.last_name,
    };
    loggerObj.reqId = req.permission_id;
    loggerObj.route = req.baseUrl + req.url;
    loggerObj.method = req.method;
    loggerObj.requestQuery = req.query ? req.query : {};
    loggerObj.requestParams = req.params ? req.params : {};
    loggerObj.requestBody = req.body ? req.body : {};
    loggerObj.data = data ? data : {};
    loggerObj.error = error ? error : {};
    loggerObj.origin = req.headers.origin;
    loggerObj.userAgent = req.get('User-Agent');
    loggerObj.host = req.header['x-forwarded-for'] || req.connection.remoteAddress;
    loggerObj.duration = ((new Date()).getTime() - req.startTime);
    Object.preventExtensions(loggerObj);
    return loggerObj;
};

module.exports = {
    logger: logger,
    userLogObj: userLogObj
};
