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

        console.log(req.user)

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
    },

    create: function (req, res) {
        return res.view('admin/edit', { create: true, item: { now: moment(), content_type: req.params.type } });
    },

    edit: function (req, res) {

        Content
            .findOne(req.params.id)
            .exec((err, item) => {
                if (typeof item === "undefined") return res.notFound();

                item.now = moment();
                item.createdAt = moment(item.createdAt);
                item.updatedAt = moment(item.updatedAt);
                if (item.publishDate)
                    item.publishDate = moment(item.publishDate);

                return res.view('admin/edit', { item: item })
            }
        );
    },

    doEdit: function (req, res) {

        // Second action performed once database is updated
        var action = function (err, content) {

            if (err)
            // Validation errors
                if (typeof err.Errors !== "undefined") {
                    var item = req.body, create = false;

                    item.now = moment();
                    item.createdAt = moment(item.createdAt);
                    item.updatedAt = moment(item.updatedAt);
                    if (item.publishDate)
                        item.publishDate = moment(item.publishDate);

                    // Continue in Create mode when errors are encountered
                    if (typeof item.id === "undefined") {
                        create = true;
                        delete item.publishDate;
                    }

                    return res.view('admin/edit', { item: item, errors: err.Errors, create: create });
                }

                // Actual server error
                else return res.serverError(err);

            // Successful update
            else {
                sails.log.debug(content);
                sails.log.debug(err);

                if (typeof content.id !== "undefined")
                    return res.redirect('/prometheus/edit/' + content.id + '?saved=true');
                else
                    return res.redirect('/prometheus/edit/' + content[0].id + '?updated=true');
            }
        };

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
                    fields.publishDate = moment().format();
            } else if (typeof fields.delete !== "undefined" && typeof fields.id !== "undefined") {
                Content.destroy({id: fields.id}).exec(
                    (err) => res.redirect('/prometheus/list/' + fields.content_type)
                );
                return;
            }

            // Remove fields that shouldn't be updated from fields object
            delete fields.id;
            delete fields.delete;
            delete fields.save;
            delete fields.publish;
            delete fields.publish_now;

            // If no id is provided, create a new content item
            if (typeof id === "undefined")
            {
                sails.log.debug("ID is undefined, creating new content");
                Content.create(fields).exec(action);
            }
            else
                Content.update(id, fields).exec(action);
        };

        // Upload failures
        var errCb = function (error, fields) {
            var item = fields;
            item.now = moment();
            item.createdAt = moment(item.createdAt);
            item.updatedAt = moment(item.updatedAt);
            if (item.publishDate)
                item.publishDate = moment(item.publishDate);

            return res.view('admin/edit', { item: item, error: error });
        };

        // Call ImageService and upload and resize image, then run Content save action
        ImageService.handleUpload(req, res, 'avatar', errCb, cb);
    },

    import: function (req, res) {
        return res.ok("import");
    }
};
