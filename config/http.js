/**
 * HTTP Server Settings
 * (sails.config.http)
 *
 * Configuration for the underlying HTTP server in Sails.
 * Only applies to HTTP requests (not WebSockets)
 *
 * For more information on configuration, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.http.html
 */
"use strict";

var moment = require('moment');
var connect = require('connect');

module.exports.http = {

    /****************************************************************************
     *                                                                           *
     * Express middleware to use for every Sails request. To add custom          *
     * middleware to the mix, add a function to the middleware config object and *
     * add its key to the "order" array. The $custom key is reserved for         *
     * backwards-compatibility with Sails v0.9.x apps that use the               *
     * `customMiddleware` config option.                                         *
     *                                                                           *
     ****************************************************************************/

    middleware: {

        passportInit    : require('passport').initialize(),
        passportSession : require('passport').session(),

        /****************************************************************************
         *                                                                           *
         * Example custom middleware; logs each request to the console.              *
         *                                                                           *
         ****************************************************************************/

        requestLogger: function (req, res, next) {
            console.log(moment().format('HH:mm:ss'), req.method, res.statusCode, req.url);
            res.set('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Origin', '*');
            return next();
        },

        mounted: connect.static('mounted'),

        order: [
            'startRequestTimer',
            'cookieParser',
            'session',
            'bodyParser',
            'passportInit',
            'passportSession',
            'requestLogger',
            'handleBodyParserError',
            'compress',
            'methodOverride',
            'router',
            'www',
            'mounted',
            '404',
            '500'
        ]
    },

    /***************************************************************************
     *                                                                          *
     * The order in which middleware should be run for HTTP request. (the Sails *
     * router is invoked by the "router" middleware below.)                     *
     *                                                                          *
     ***************************************************************************/

    /***************************************************************************
     *                                                                          *
     * The body parser that will handle incoming multipart HTTP requests. By    *
     * default as of v0.10, Sails uses                                          *
     * [skipper](http://github.com/balderdashy/skipper). See                    *
     * http://www.senchalabs.org/connect/multipart.html for other options.      *
     *                                                                          *
     ***************************************************************************/

     bodyParser: require('body-parser'),

    /***************************************************************************
     *                                                                          *
     * The number of seconds to cache flat files on disk being served by        *
     * Express static middleware (by default, these files are in `.tmp/public`) *
     *                                                                          *
     * The HTTP static cache is only active in a 'production' environment,      *
     * since that's the only time Express will cache flat-files.                *
     *                                                                          *
     ***************************************************************************/

    cache: 31557600000
};
