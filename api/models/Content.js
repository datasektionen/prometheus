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
        title_sv: {
            type: 'string',
            required: true
        },
        title_en: {
            type: 'string',
            required: true
        },

        content_sv: {
            type: 'string',
            required: true
        },
        content_en: {
            type: 'string',
            required: true
        },
        publishDate: 'datetime',
        sticky: 'boolean',
        tags: 'array',
        image: 'string',

        // METADATA
        // Author can be KTH ID (e.g. johan for johan@kth.se) or functionary role (e.g. d-sys for Systemansvarig)
        author: {
            type: 'string',
            required: true
        },

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

    validationMessages: {
        title_sv: { required: "Du måste fylla i titel (svenska)" },
        title_en: { required: "Du måste fylla i titel (engelska)" },
        content_sv: { required: "Du måste fylla i innehåll (svenska)" },
        content_en: { required: "Du måste fylla i innehåll (engelska)" }
    }
};