/**
 * AdminController
 *
 * @description :: Server-side logic for managing news and event items
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
/* globals ImageService, Content */
/* jshint esnext: true */
"use strict";

var moment = require('moment');
moment.locale('sv');

module.exports = {

    _config: {
        actions: false,
        shortcuts: false,
        rest: false
    },

    home: function (req, res) {
        return res.redirect('/prometheus/list/post');
    },

    list: function (req, res) {
        var type = req.params.type;

        Content
            .find({ where: { content_type: type }, sort: "updatedAt DESC" })
            .exec(function (err, items) {
                if (err)
                    return res.serverError(err);

                items = items.map(function (item) {
                    item.createdAt = moment(item.createdAt);
                    item.updatedAt = moment(item.updatedAt);
                    if (typeof item.publishDate !== "undefined" && item.publishDate !== "")
                        item.publishDate = moment(item.publishDate);

                    return item;
                });

                return res.view('admin/list', { items: items, type: type });
            });
    }

};
