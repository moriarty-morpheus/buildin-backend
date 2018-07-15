/*jshint node: true*/
'use strict';
const actionsStore = {
    Users: require('./mongoDB/actions/users').Users,
    Sessions: require('./mongoDB/actions/sessions').Sessions,
    PasswordTokens: require('./mongoDB/actions/passwordTokens').PasswordTokens,
    Complaints: require('./mongoDB/actions/complaints').Complaints
}

module.exports = {
    actionsStore: actionsStore
};
