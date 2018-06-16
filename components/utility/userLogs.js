/*jshint node: true*/
'use strict';
/**
 *  Logger Module
 */

/**
  import npm modules
*/
const {createLogger, format, transports} = require('winston');
const debug = createLogger({
    level: 'debug',
    format: format.combine(format.colorize(), format.simple()),
    transports: [
        new transports.Console(),
        new transports.File({
            filename: 'debug.log',
            level: 'debug',
            dirname: __dirname + '/../../logs',
        })
    ],
    exitOnError: false
});

const info = createLogger({
    level: 'info',
    format: format.combine(format.colorize(), format.simple()),
    transports: [
        new transports.Console(),
        new transports.File({
            filename: 'info.log',
            level: 'info',
            dirname: __dirname + '/../../logs',
        })
    ],
    exitOnError: false
});

const error = createLogger({
    level: 'error',
    format: format.combine(format.colorize(), format.simple()),
    transports: [
        new transports.Console(),
        new transports.File({
            filename: 'error.log' ,
            level: 'error',
            dirname: __dirname + '/../../logs',
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
    }
};

let logFn = function logFn(
                        req, data, error) {
    let loggerObj = {};
    if (req.user) {
        loggerObj.user = {
            id: req.user.user_id,
            firstname: req.user.first_name,
            lastname: req.user.last_name,
        };
    } else {
        loggerObj.user = null;
    }
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
    logFn: logFn
};
