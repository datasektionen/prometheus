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

var fs = require('fs');

module.exports = {

    _config: {
        actions: false,
        shortcuts: false,
        rest: false
    },
    
    list: function (req, res) {
        var language = req.params.language;
        var type = req.params.type;
        var filters = {
            publishDate: { '<': new Date() }
        };

        if (type !== "all")
            filters.content_type = type;

        var fields = ['id', 'content_type', 'author', 'image', 'sticky', 'publishDate', 'facebookEvent',
            'googleForm', 'eventStart', 'eventEnd', 'eventLocation'];
        fields.push('title_' + language);
        fields.push('content_' + language);

        Content
            .find({
                where: filters,
                sort: 'publishDate DESC'
            })
            .exec(function (err, content) {
                return res.jsonx(content.map(function (item) {
                    // Limit result to given properties
                    var i = {};
                    Object.keys(item).forEach(key => { if (fields.indexOf(key) !== -1) return i[key] = item[key] });
                    i['content_' + language] = markdown.toHTML(item['content_' + language]);

                    return i;
                }));
            });
    },

    item: function (req, res) {
        var id = req.params.id;

        var fields = ['id', 'content_type', 'author', 'image', 'sticky', 'publishDate', 'facebookEvent',
            'googleForm', 'eventStart', 'eventEnd', 'eventLocation', 'title_sv', 'title_en', 'content_sv', 'content_en'];

        Content.findOne(id).exec(function (err, item) {
            // Limit result to given properties
            var i = {};
            Object.keys(item).forEach(key => { if (fields.indexOf(key) !== -1) return i[key] = item[key] });

            // Convert Markdown to HTML
            i['content_sv'] = markdown.toHTML(item['content_sv']);
            i['content_en'] = markdown.toHTML(item['content_en']);

            return res.jsonx(i);
        });
    },

    sticky: function (req, res) {
        Content
            .find({where: { sticky: true }, limit: 1, sort: 'publishDate DESC'})
            .exec((err, item) => err ? res.serverError(err) : res.send(item));
    }
    
};