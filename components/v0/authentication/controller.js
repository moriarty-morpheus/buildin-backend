/*jshint node: true */
"use strict";
/**
 * Import Required Node Modules
 */
const Q = require('q');
const _ = require('underscore');
/**
 * Import Required Project Modules
 */
const actionsStore = require('../../../database/store').actionsStore;
const responseStore = require('../../utility/store').responseStore;
const logger = require('../../utility/userLogs').logger;
const logFn = require('../../utility/userLogs').logFn;
const constants = require('../../utility/constants');
const componentConstants = require('./constants');
const helper = require('./helper');
const Users = new actionsStore.Users('v0');
const Sessions = new actionsStore.Sessions('v0');
const PasswordTokens = new actionsStore.PasswordTokens('v0');
/**
 * Authentication controller
 */
const controller = {};

/**
 *  Register a new user
 *  @param {object}  req - request object.
 *  @param {object}  res - response object.
 *  @return {object}
 */
controller.register = function(req, res, next) {
  logger.debug('register controller', logFn(_.omit(req, "body"), null, null));
  logger.info('register controller', logFn(_.omit(req, "body"), null, null));
  let response;
  try {
    let userNamePromise = Users.checkUserName(req.body);
    let emailPromise = Users.checkEmail(req.body);
    Q.all([userNamePromise, emailPromise]).then(function(validations) {
      if (validations[0].code === 200 || validations[1].code === 200) {
        response = responseStore.get(409);
        if (validations[0].code !== 200) {
          response.message = 'Oops! This Email Already Exists';
          res.finalResponse = response;
          res.finalMessage = "register cntrl Validation Failed Error";
          next();
        } else if (validations[1].code !== 200) {
          response.message = 'Oops! This Username Already Exists';
          res.finalResponse = response;
          res.finalMessage = "register cntrl Validation Failed Error";
          next();
        } else {
          response.message = 'Oops! This Username and Email Already Exist';
          res.finalResponse = response;
          res.finalMessage = "register cntrl Validation Failed Error";
          next();
        }
      } else {
        if (_.keys(req.body).indexOf("is_admin")) {
          req.body.is_admin = req.body.is_admin === true ? true : false;
        } else {
          req.body.is_admin = false;
        }
        req.body.is_approved = false;
        req.body.is_active = false;
        req.body.permissions = componentConstants.defaultPermissions;
        let createUserPromise = Users.createUser(req.body);
        createUserPromise.then(function(result) {
          let emailsPromise = helper.sendRegiterEmails(
                                req, res, req.body.email, req.body.user_name
                              );
          emailsPromise.then(function(results) {
            response = responseStore.get(201);
            response.message = 'Hey! Your Account Is Created Successfully';
            res.finalResponse = response;
            res.finalMessage = "register cntrl Success";
            next();
          }, function(error) {
            response = responseStore.get(500);
            res.error = error;
            res.finalResponse = response;
            res.finalMessage = "register cntrl emailPromises error";
            next();
          })
        }, function(error) {
          response = responseStore.get(500);
          res.error = error;
          res.finalResponse = response;
          res.finalMessage = "register cntrl createUserPromise error";
          next();
        });
      }
    }, function(error) {
      response = responseStore.get(500);
      res.error = error;
      res.finalResponse = response;
      res.finalMessage = "register cntrl check data promises error";
      next();
    });
  } catch (error) {
    response = responseStore.get(500);
    res.error = error;
    res.finalResponse = response;
    res.finalMessage = "register cntrl error";
    next();
  }
}

/**
 *  Login a user
 *  @param {object}  req - request object.
 *  @param {object}  res - response object.
 *  @return {object}
 */
controller.login = function(req, res, next) {
  logger.debug('login controller', logFn(_.omit(req, "body"), null, null));
  logger.info('login controller', logFn(_.omit(req, "body"), null, null));
  let response;
  try {
    let userNamePromise = Users.checkUserName(req.body);
    let getUserPromise = Users.getUserByUsernamePassword(req.body);
    Q.all([userNamePromise, getUserPromise]).then(function(results) {
      let userNameResult = results[0];
      let getUserResult = results[1];
      if (userNameResult.code === 200 && getUserResult.code === 200) {
        if (getUserResult.data.is_approved &&
          getUserResult.data.is_active
        ) {
          let accessTokenObj = helper.createTokenObj(
                      req, res, getUserResult.data
                    );
          let createTokenPromise = Sessions.createToken(
                        accessTokenObj
                      );
          createTokenPromise.then(function(tokenResult) {
            response = responseStore.get(200);
            response.data = _.omit(accessTokenObj,
              ["hashed_password"]
            );
            res.finalResponse = response;
            res.finalMessage = "login cntrl success";
            next();
          }, function(error) {
            response = responseStore.get(500);
            res.error = error;
            res.finalResponse = response;
            res.finalMessage = "login cntrl createTokenPromise error";
            next();
          })
        } else {
          response = responseStore.get(403);
          response.message = 'Your account approval is ' +
            'pending. Please contact our admin at ' +
            'admin@help.com';
          res.finalResponse = response;
          res.finalMessage = "login cntrl approval pending error";
          next();
        }
      } else {
        response = responseStore.get(401);
        response.message = 'Incorrect username and/or password. ' +
          'Please check your credentials and try again';
        res.finalResponse = response;
        res.finalMessage = "login cntrl invalid credentials error";
        next();
      }
    }, function(error) {
      response = responseStore.get(500);
      res.error = error;
      res.finalResponse = response;
      res.finalMessage = "login cntrl user promises error";
      next();
    });
  } catch (error) {
    response = responseStore.get(500);
    res.error = error;
    res.finalResponse = response;
    res.finalMessage = "login cntrl error";
    next();
  }
}

/**
 *  Logout a user
 *  @param {object}  req - request object.
 *  @param {object}  res - response object.
 *  @return {object}
 */
controller.logout = function(req, res, next) {
  logger.debug('logout controller', logFn(req, null, null));
  logger.info('logout controller', logFn(req, null, null));
  let response;
  try{
    let deleteSessionPromise = Sessions.deleteAccessToken(req.user);
    deleteSessionPromise.then(function(deleteSessionResult) {
      if (deleteSessionResult.code === 200) {
        response = responseStore.get(200);
        response.message = "Logout Successful"
        res.finalResponse = response;
        res.finalMessage = "logout cntrl success";
        next();
      } else {
        response = responseStore.get(500);
        res.finalResponse = response;
        res.finalMessage = "logout cntrl deleteSessionPromise error";
        next();
      }
    }, function(error) {
      response = responseStore.get(500);
      res.error = error;
      res.finalResponse = response;
      res.finalMessage = "logout cntrl deleteSessionPromise error";
      next();
    });
  } catch (error) {
    response = responseStore.get(500);
    res.error = error;
    res.finalResponse = response;
    res.finalMessage = "logout cntrl error";
    next();
  }
}

/**
 *  Create a token if the user forgets password
 *  @param {object}  req - request object.
 *  @param {object}  res - response object.
 *  @return {object}
 */
controller.forgotPasswordToken = function(req, res, next) {
  logger.debug('forgotPasswordToken controller', logFn(req, null, null));
  logger.info('forgotPasswordToken controller', logFn(req, null, null));
  try {
    let response, getUserPromises = [];
    getUserPromises.push(Users.checkUserName(req.body));
    getUserPromises.push(Users.checkEmail(req.body));
    Q.all(getUserPromises).then(function(validations) {
      if (validations[0].code === 200 || validations[1].code === 200) {
        let user_id = validations[0].data.user_id;
        let getTokenPromise = PasswordTokens.getTokenByUserId({'user_id': user_id});
        getTokenPromise.then(function(tokenResult) {
          let passwordToken, createTokenPromise;
          if (tokenResult.code === 200 && tokenResult.data.is_used === false
            && (new Date()).getTime() - new Date(tokenResult.data.created_date).getTime() < 864000) {
              let deferred = Q.defer();
              deferred.resolve(tokenResult);
              createTokenPromise = deferred.promise;
            } else {
              let tokenObj = {
                'user_id': user_id
              }
              createTokenPromise = PasswordTokens.addToken(tokenObj);
            }
            createTokenPromise.then(function(createResult) {
              let emailPromise = helper.sendForgotPasswordEmail(
                req, res, req.body.email, req.body.user_name,
                createResult.data.password_token
              );
              emailPromise.then(function(result) {
                response = responseStore.get(200);
                response.data = {};
                response.message = "An email has been sent to your registered "+
                "email. Please follow the instructions "+
                "in the email to reset your password.";
                res.finalResponse = response;
                res.finalMessage = "Token Succes"
                next();
              }, function(error) {
                response = responseStore.get(500);
                resp.error = error;
                res.finalResponse = response;
                res.finalMessage = "forgotPasswordToken cntrl emailPromise error";
                next();
              });
            }, function(error) {
              response = responseStore.get(500);
              res.error = error;
              res.finalResponse = response;
              res.finalMessage = "forgotPasswordToken cntrl createTokenPromise error";
              next();
            });

          }, function(error) {
            response = responseStore.get(500);
            res.error = error;
            res.finalResponse = response;
            res.finalMessage = "forgotPasswordToken cntrl getTokenPromise error";
            next();
          });
        } else {
          response = responseStore.get(401);
          response.message = "Invalid credentials";
          res.finalResponse = response;
          res.finalMessage = "forgotPasswordToken cntrl invalid credentials error";
          next();
        }
      }, function(error) {
        response = responseStore.get(500);
        res.error = error;
        res.finalResponse = response;
        res.finalMessage = "forgotPasswordToken cntrl mongo error";
        next();
      });
  } catch (error) {
    response = responseStore.get(500);
    res.error = error;
    res.finalResponse = response;
    res.finalMessage = "forgotPasswordToken cntrl error";
    next();
  }
}

/**
 *  Check if the user token for resetting password is valid
 *  @param {object}  req - request object.
 *  @param {object}  res - response object.
 *  @return {object}
 */
controller.resetPasswordCheck = function(req, res, next) {
  logger.debug('resetPasswordCheck controller', logFn(_.omit(req, "body"), null, null));
  logger.info('resetPasswordCheck controller', logFn(_.omit(req, "body"), null, null));
  try {
    let response;
    let passwordTokenPromise = PasswordTokens.getToken({'password_token': req.query.id});
    passwordTokenPromise.then(function(tokenResult) {
      if (tokenResult.code === 200 && tokenResult.data.is_used === false
        && (new Date()).getTime() - new Date(tokenResult.data.created_date).getTime() < 864000) {
        response = responseStore.get(200);
        response.message = "Token Validation Successful";
        res.finalResponse = response;
        res.finalMessage = "resetPasswordCheck successs";
        next();
      } else {
        response = responseStore.get(404);
        response.message = "Token is invalid/expired";
        res.finalResponse = response;
        res.finalMessage = "resetPasswordCheck cntrl passwordTokenPromise error";
        next();
      }
    }, function(error) {
      response = responseStore.get(500);
      res.error = error;
      res.finalResponse = response;
      res.finalMessage = "resetPasswordCheck cntrl passwordTokenPromise error";
      next();
    });
  } catch (error) {
    response = responseStore.get(500);
    res.error = error;
    res.finalResponse = response;
    res.finalMessage = "resetPasswordCheck cntrl error";
    next();
  }
}

/**
 *  Reset password for a user
 *  @param {object}  req - request object.
 *  @param {object}  res - response object.
 *  @return {object}
 */
controller.resetPassword = function(req, res, next) {
  logger.debug('resetPassword controller', logFn(_.omit(req, "body"), null, null));
  logger.info('resetPassword controller', logFn(_.omit(req, "body"), null, null));
  try {
    let response;
    let passwordTokenPromise = PasswordTokens.getToken({'password_token': req.query.id});
    passwordTokenPromise.then(function(tokenResult) {
      if (tokenResult.code === 200 && tokenResult.data.is_used === false
        && (new Date()).getTime() - (new Date(tokenResult.data.created_date)).getTime() < 864000000) {
        let resetPasswordPromise = Users.updateUserPassword(
                                    tokenResult.data.user_id, req.body.password
                                  );
        resetPasswordPromise.then(function(resetResult) {
          if (resetResult.code === 200) {
            response = responseStore.get(200);
            response.message = "Password Reset Successful";
            res.finalMessage = "resetPassword cntrl success";
            res.finalResponse = response;
            next();
          } else {
            response = responseStore.get(500);
            res.error = error;
            res.finalResponse = response;
            res.finalMessage = "resetPassword cntrl error";
            next();
          }
        }, function(error) {
          response = responseStore.get(500);
          res.error = error;
          res.finalResponse = response;
          res.finalMessage = "resetPassword cntrl resetPasswordPromise error";
          next();
        })
      } else {
        response = responseStore.get(404);
        response.message = "Token is invalid/expired";
        res.finalResponse = response;
        res.finalMessage = "resetPassword cntrl error";
        next();
      }
    }, function(error) {
      response = responseStore.get(500);
      res.error = error;
      res.finalResponse = response;
      res.finalMessage = "resetPassword cntrl passwordTokenPromise error";
      next();
    });
  } catch (error) {
    response = responseStore.get(500);
    res.error = error;
    res.finalResponse = response;
    res.finalMessage = "resetPassword cntrl error";
    next();
  }
}

/**
 *  Set permissions for a user
 *  @param {object}  req - request object.
 *  @param {object}  res - response object.
 *  @return {object}
 */
controller.setPermissions = function(req, res, next) {
  logger.debug('setPermissions controller', logFn(_.omit(req, "body"), null, null));
  logger.info('setPermissions controller', logFn(_.omit(req, "body"), null, null));
  try {
    let response;
    let adminCode = req.query.admin_code;
    if (!adminCode || adminCode !== componentConstants.adminCode) {
      response = responseStore.get(403);
      res.finalResponse = response;
      res.finalMessage = "setPermissions cntrl admin_code error";
      next();
    }
    let userObj = req.body;
    let userId = req.query.user_id;
    let editPermissionsPromise = Users.setPermissions(userId, userObj);
    editPermissionsPromise.then(function(editResult) {
      if (editResult.code === 200) {
        response = responseStore.get(200);
        response.message = "Permissions Setting Successful";
        res.finalMessage = "Permissions Setting Successfil";
        res.finalResponse = response;
        next();
      } else {
        response = responseStore.get(500);
        res.finalResponse = response;
        res.finalMessage = "setPermissions cntrl editPermissionsPromise error";
        next();
      }
    }, function(error) {
      response = responseStore.get(500);
      res.error = error;
      res.finalResponse = response;
      res.finalMessage = "setPermissions cntrl editPermissionsPromise error";
      next();
    });
  } catch (error) {
    response = responseStore.get(500);
    res.error = error;
    res.finalResponse = response;
    res.finalMessage = "setPermissions cntrl error";
    next();
  }
}

/**
 *  Function to handle response sending
 *  @param {object}  req - request object.
 *  @param {object}  res - response object.
 *  @return {object}
 */
controller.sendResponse = function(req, res, next) {
  let result = res.finalResponse;
  if (constants.responseCodes.error.indexOf(res.finalResponse.code) > -1) {
    result.actualError = res.error;
    logger.debug(
      res.finalMessage,
      logFn(_.omit(req, "body"), null, result)
    );
    logger.error(
      res.finalMessage,
      logFn(_.omit(req, "body"), null, result)
    );
  } else {
    logger.debug(
      res.finalMessage,
      logFn(_.omit(req, "body"), null, result)
    );
    logger.info(
      res.finalMessage,
      logFn(_.omit(req, "body"), null, result)
    );
  }
  return res.status(res.finalResponse.code).send(_.omit(res.finalResponse,"actualError"));
}

module.exports = controller;
