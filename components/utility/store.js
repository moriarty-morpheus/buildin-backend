/*jshint node: true*/
'use strict';
const responses = {
    200: {
        "code": 200,
        "status": "success",
        "data": {}, /*Method specific data*/
        "message": null /* Or optional success message */
    },
    201: {
        "code": 201,
        "status": "created",
        "data": {},
        "message": null
    },
    500: {
        "code": 500,
        "status": "Error",
        "message": "Internal Server Error!",
        "error": {}
    },
    501: {
        "code": 501,
        "status": "DB Error",
        "message": "Invalid Query",
        "error": {}
    },
    550: {
        "code": 550,
        "status": "Send email",
        "message": "Requested action not taken: mailbox unavailable",
        "error": {}
        },
    400: {
        "code": 400,
        "status": "Bad Request",
        "message": "Validation failed.",
        "error": {}
    },
    401: {
        "code": 401,
        "status": "Unauthorized",
        "message": "Incorrect credentials",
        "error": {}
    },
    403: {
        "code": 403,
        "status": "Forbidden",
        "message": "Requested Action is Not Permitted",
        "error": {}
    },
    404: {
        "code": 404,
        "status": "Not Found",
        "message": "Not Found",
        "error": {}
    },
    422: {
        "code": 422,
        "status": "Unprocesseable Entity",
        "message": "Validation failed.",
        "error": {}
    },
    409: {
        "code": 409,
        "status": "Conflict",
        "message": "Data duplication error.",
        "error": {}
    },
    405: {
        "code": 405,
        "status": "Method not allowed.",
        "message": "Incorrect method.",
        "error": {}
    },
    406: {
        "code": 406,
        "status": "Not acceptable.",
        "message": "Incorrect Content-Type. Try with application/json.",
        "error": {}
    },
    413: {
        "code": 413,
        "status": "Request Entity Too Large.",
        "message": "File is too large.",
        "error": {}
    },
    415: {
        "code": 415,
        "status": "Unsupported Media Type.",
        "message": "File format is not supported.",
        "error": {}
    },
    503: {
        "code": 503,
        "status": "Service Unavailable",
        "message": "Server Too busy.",
        "error": {}
    },
    507: {
        "code": 507,
        "status": "Insufficient Storage",
        "message": "File limit exceeded.",
        "error": {}
    }
};

function responseStore() {

}

responseStore.get = function (type) {
  let obj = JSON.parse(JSON.stringify(responses[type]));
  return obj;
}

module.exports = {
    responseStore: responseStore
}
