/**
 * Content.js
 *
 * @description :: Represents content objects, i.e. posts and events
 */
/* jshint esnext: true */
"use strict";

module.exports = {

    attributes: {

        content_type: {
            type: 'string',
            enum: ['post', 'event'],
            required: true
        },
        content_published: {
            type: 'boolean',
            required: true,
            defaultsTo: false
        },

        title_sv: {
            type: 'string',
            required: true
        },
        title_en: {
            type: 'string',
            required: true
        },

        content_sv: {
            type: 'text',
            required: true
        },
        content_en: {
            type: 'text',
            required: true
        },
        content_sticky: 'boolean',
        content_tags: 'array',

        // METADATA
        // Author KTH ID (e.g. johan for johan@kth.se)
        // Author role (e.g. d-sys for Systemansvarig)
        author_kthid: {
            type: 'string',
            required: true
        },
        author_role: {
            type: 'string',
            required: true
        },
        publishDate: 'datetime',

        // EVENT PROPERTIES
        eventStart: 'datetime',
        eventEnd: 'datetime',
        eventLocation: 'string',

        // EXTERNAL LINKS
        facebookEvent: {
            type: 'string',
            url: true
        },
        googleForm: {
            type: 'string',
            url: true
        }

    },

    validationMessages: {}
};