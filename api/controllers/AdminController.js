/**
 * CoachController
 *
 * @description :: Server-side logic for managing news and event items
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
/* globals ImageService, Content */
/* jshint esnext: true */
"use strict";

var moment = require('moment');

module.exports = {

    _config: {
        actions: false,
        shortcuts: false,
        rest: false
    },

    home: function (req, res) {
        return res.view('admin/home');
    },

    list: function (req, res) {
        var type = req.params.type;

        Content
            .find({ content_type: type })
            .exec(function (err, items) {
                if (err)
                    return res.serverError(err);

                return res.view('admin/list', { items: items, type: type });
            });
    },

    create: function (req, res) {

        var create = {
            content_type: req.params.type,
            author_kthid: req.user.user,
            author_role: "",
            title_en: "",
            title_sv: "",
            content_sv: "",
            content_en: ""
        };

        Content
            .create(create)
            .exec((err, item) =>
                err ? res.serverError(err) : res.redirect('/prometheus/edit/' + item.id));
    },

    edit: function (req, res) {

        Content
            .findOne(req.params.id)
            .exec((err, item) =>
                typeof item === "undefined" ? res.notFound() : res.view('admin/edit', {item: item}));
    },

    doEdit: function (req, res) {

        // Second action performed once database is updated
        var action = function (err, content) {

            if (err)
                // Validation errors
                if (typeof err.Errors !== "undefined")
                    return res.view('admin/edit', { item: req.body, errors: err.Errors});

                // Actual server error
                else return res.serverError(err);

            // Successful update
            else
                if (typeof content.id !== "undefined")
                    return res.redirect('/prometheus/edit/' + content.id + '?saved=true');
                else
                    return res.redirect('/prometheus/edit/' + content[0].id + '?updated=true');
        };

        // Call ImageService and upload and resize image, then run Content save action
        var errCb = (error, fields) => res.view('admin/edit', { item: fields, error: error });
        var cb = function (fileName, fields) {
            // Metadata variables
            var id = fields.id;

            if (typeof fileName !== "undefined")
                fields.image = fileName;

            // Remove fields that shouldn't be updated from fields object
            delete fields.id;
            delete fields.createdAt;

            // If no id is provided, create a new content item
            if (typeof id === "undefined")
                Content.create(fields).exec(action);
            else
                Content.update(id, fields).exec(action);
        };

        ImageService.handleUpload(req, res, 'image', errCb, cb);
    }
};