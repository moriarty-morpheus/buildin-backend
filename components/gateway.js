/*jshint node: true*/
'use strict';
/**
 *  import project modules
 */
const config = require('config');
const apiVersions = config.get('apiConfig').apiVersions;

const rootRoutes = function(app) {
    /**
     *	Default Gateway
     */
    app.get('/', function(req, res) {
        res.send('Welcome');
    });

    /**
     *  Default API Gateway
     */
    app.get('/api', function(req, res) {
        res.json(apiVersions);
    });

    /**
     *	API Gateways With Versions
     */
    for (let k = 0; k < apiVersions.length; k++) {
        /**
         * Authentication Gateway
         */
        app.use(
            '/api/v' + apiVersions[k] + '/auth',
            require('./v' + k + '/authentication/route')
        );
        /**
         * Dashboard Gateway
         */
        app.use(
            '/api/v' + apiVersions[k] + '/dashboard',
            require('./v' + k + '/dashboard/route')
        );
        /**
         * Complaints Gateway
         */
        app.use(
            '/api/v' + apiVersions[k] + '/complaints',
            require('./v' + k + '/complaints/route')
        );
        /**
         * Announcements Gateway
         */
        app.use(
            '/api/v' + apiVersions[k] + '/announcements',
            require('./v' + k + '/announcements/route')
        );
        /**
         * Users Gateway
         */
        app.use(
            '/api/v' + apiVersions[k] + '/users',
            require('./v' + k + '/users/route')
        );
    }
};

/**
 * Export Routes
 */
module.exports = rootRoutes;
