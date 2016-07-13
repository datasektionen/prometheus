/**
 * ApiController
 *
 * @description :: Server-side logic for managing user files and RESTful API
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
/* globals Content */
/* jshint esnext: true */
"use strict";
var markdown = require('markdown').markdown;

function sanitize(item) {
    return Object.assign({}, item, {
        content_sv:    markdown.toHTML(item.content_en),
        content_en:    markdown.toHTML(item.content_en)
    });
}

module.exports = {

    _config: {
        actions: false,
        shortcuts: false,
        rest: false
    },
    
    list: function (req, res) {
        var type = req.params.type
        var filters = {
            publishDate: { '<': new Date() },
            content_type: type == 'all' ? ['event', 'post'] : type
        };

        Content
            .find({
                where: filters,
                sort: 'publishDate DESC'
            })
            .exec((err, items) => err ? res.serverError(err) : res.send(items.map(sanitize)));
    },

    item: function (req, res) {
        Content
            .findOne(req.params.id)
            .exec((err, item) => err ? res.serverError(err) : res.send(sanitize(item)));
    },

    sticky: function (req, res) {
        Content
            .find({
                where: { sticky: true },
                limit: 1,
                sort: 'publishDate DESC'
            })
            .exec((err, items) => err ? res.serverError(err) : res.send(items.map(sanitize)));
    }
    
};
