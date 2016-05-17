/**
 * AuthController
 *
 * @description :: Server-side logic for managing Auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
/* globals User, Calendar, ScheduleService, MailService, Token, sails */
/* jshint esnext: true */
"use strict";

var passport = require('passport');
var moment = require('moment');

module.exports = {

    _config: {
        actions: false,
        shortcuts: false,
        rest: false
    },

    /**
     * POST /login
     * Try to authenticate a user with given credentials as POST variables
     */
    login: function (req, res) {
        passport.authenticate('dauth', {
            successRedirect: '/prometheus/list/post',
            failureRedirect: '/fail'
        })(req, res);
    },

    /**
     * End the currently logged in user's session.
     */
    logout: function (req, res) {
        req.logout();
        res.redirect('/');
    }

};
