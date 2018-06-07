/*jshint node: true*/
'use strict';
const actionsStore = {
    Users: require('./mongoDB/actions/users').Users,
    Sessions: require('./mongoDB/actions/sessions').Sessions
}

module.exports = {
    actionsStore: actionsStore
};
