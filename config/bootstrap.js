/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */
/* globals sails */
/* jshint esnext: true */
"use strict";

var mongoose = require('mongoose');

module.exports.bootstrap = function(cb) {

    // It's very important to trigger this callback method when you are finished
    // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)

    /**
     * Open a Mongoose connection to MongoDB for GridFS usage
     */
    mongoose.connect(sails.config.connectionString);
    var db = mongoose.connection;

    db.on('error', console.error.bind(console, 'Mongoose connection error:'));
    db.once('open', cb);
};
