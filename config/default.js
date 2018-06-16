/*jshint node: true*/
'use strict';
require('dotenv').load();

/**
 * MongoDB Config
 */
const mongoConfig = {
    collections: {
        users: 'users',
        products: 'products',
        sessions: 'sessions',
        passwordTokens: 'password_tokens'
    },
    connections: {
        development: {
            v0: 'mongodb://127.0.0.1:27017/dailyAid'
        },
        local: {
            v0: 'mongodb://127.0.0.1:27017/dailyAid'
        }
    }
}

/**
 * APIs Config
 */
const apiConfig = {
    apiVersions: [0]
}

const gmailConfig = {
    client_id: process.env.GMAIL_CLIENT_ID,
    client_secret: process.env.GMAIL_CLIENT_SECRET,
    redirect_uri: process.env.GMAIL_REDIRECT_URI,
    token: process.env.GMAIL_TOKEN,
    refresh_token: process.env.GMAIL_REFRESH_TOKEN,
    from_email_id: process.env.FROM_ID,
    admin_id: process.env.ADMIN_ID
}

module.exports = {
    mongoConfig: mongoConfig,
    apiConfig: apiConfig,
    gmailConfig: gmailConfig
}
