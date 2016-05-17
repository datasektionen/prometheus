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

        var type = req.params.type;
        var title_en = (type === "event") ? "New event" : "New post";
        var title_sv = (type === "event") ? "Nytt event" : "Ny post";

        var create = {
            content_type: req.params.type,
            author_kthid: req.user.user,
            author_role: "d-sys",
            title_en: title_en,
            title_sv: title_sv,
            content_sv: "&nbsp;",
            content_en: "&nbsp;"
        };

        Content
            .create(create)
            .exec((err, item) =>
                err ? res.serverError(err) : res.redirect('/prometheus/edit/' + item.id));
    },

    edit: function (req, res) {

        Content
            .findOne(req.params.id)
            .exec((err, item) => {
                if (typeof item === "undefined") return res.notFound();

                item.now = moment();
                item.createdAt = moment(item.createdAt);
                item.updatedAt = moment(item.updatedAt);
                return res.view('admin/edit', { item: item })
            }
        );
    },

    doEdit: function (req, res) {

        // Successful upload
        var cb = function (fileName, fields) {
            sails.log.debug(fields);

            // Metadata variables
            var id = fields.id;

            if (typeof fileName !== "undefined")
                fields.image = fileName;

            // If publish now is selected and
            if (typeof fields.publish_now !== "undefined") {
                if (fields.publish_now === "true" && typeof fields.publish !== "undefined")
                    fields.publishDate = Date.now();
            }

            // Remove fields that shouldn't be updated from fields object
            delete fields.id;

            // Run database update
            Content.update(id, fields).exec(function (err, content) {

                if (err)
                // Validation errors
                    if (typeof err.Errors !== "undefined") {
                        var item = req.body;
                        item.now = moment();
                        item.createdAt = moment(item.createdAt);
                        item.updatedAt = moment(item.updatedAt);
                        return res.view('admin/edit', { item: item, errors: err.Errors});
                    }

                    // Actual server error
                    else return res.serverError(err);

                // Successful update
                else
                    if (typeof content.id !== "undefined")
                        return res.redirect('/prometheus/edit/' + content.id + '?saved=true');
                    else
                        return res.redirect('/prometheus/edit/' + content[0].id + '?updated=true');
            });
        };

        // Upload failures
        var errCb = function (error, fields) {
            var item = fields;
            item.now = moment();
            item.createdAt = moment(item.createdAt);
            item.updatedAt = moment(item.updatedAt);
            return res.view('admin/edit', { item: item, error: error });
        };

        // Call ImageService and upload and resize image, then run Content save action
        ImageService.handleUpload(req, res, 'avatar', errCb, cb);
    },

    import: function (req, res) {
        return res.ok("import");
    }
};