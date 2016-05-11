// ImageService.js
/* globals ScheduleService, sails */
/* jshint esnext: true */
"use strict";

var multer = require('multer');
var Jimp = require('jimp');

//
// IMAGE SERVICE PRIVATE FUNCTIONS
//

/**
 * Process an error
 *
 * @param {Error}       err     Jimp error
 * @param {Express.req} req     Sails response object
 * @param {Express.res} res     Sails response object
 * @param {function}    errCb   Callback ran when error processing is done
 */
function processError(err, req, res, errCb) {
    var error;
    if (err.message.indexOf("Unsupported MIME") !== -1)
        error = new Error("Filen måste vara en bildfil.", module.exports.ERR_UNSUPPORTED_TYPE);
    else
        error = new Error("Uppladdningsfel: " + err, module.exports.ERR_GENERIC);

    // If no error callback is provided, just throw
    if (typeof errCb !== "function")
        return res.serverError(err);
    else
        errCb(error, req.body);
}

/**
 * Resize an image and save it to disk.
 * Image data should be provided in the req.file object by multer.
 *
 * @param {Express.req} req     Request object from controller
 * @param {Express.res} res     Response object from controller
 * @param {function}    errCb   Function to run when an error is encountered
 * @param {number}      w       Image width
 * @param {number}      h       Image height
 * @param {function}    cb      Callback when image processing and storage is done
 */
function resizeAndSave(req, res, errCb, w, h, cb) {
    // Guard against malformed data
    if (typeof req.file === "undefined")
        return cb(undefined, req.body);

    // Read the uploaded file into Jimp
    Jimp.read(req.file.buffer, function (err, image) {
        // Process read errors
        if (err) return processError(err, req, res, errCb);

        // Construct file name
        var fileName = req.user.user + Math.random() * 10000 + req.file.originalname;
        var fileNameWithExt = fileName + "_" + w + "_" + h + ".jpg";

        // Resize and get JPEG
        image.cover(w, h)
            .quality(75)
            .write(sails.config.images.uploadDir + '/' + fileNameWithExt, function (err, yolo) {
                if (err)
                    errCb(module.exports.ERR_GENERIC, req.body);
                else
                    cb(fileName, req.body);
            });
    });
}

//
// IMAGE SERVICE PUBLIC FUNCTIONS
//

module.exports = {

    ERR_UNSUPPORTED_TYPE: 1,
    ERR_GENERIC: 2,

    /**
     * Processes incoming image uploads, and saves a hero-sized version
     * and a thumbnail to MongoDB GridFS.
     *
     * @param {Express.req} req         Request object from Controller
     * @param {Express.res} res         Response object from Controller
     * @param {String}      fieldName   Form field name
     * @param {Function}    errCb       Error callback: errCb(error_code)
     * @param {Function}    cb          Callback: cb()
     */
    handleUpload: function (req, res, fieldName, errCb, cb) {
        var upload = multer({ limits: { fileSize: 512000 } }).single(fieldName);
        var gfs = Grid(mongoose.connection.db, mongoose.mongo);

        upload(req, res, function (err) {
            if (err) return processError(err, req, res, errCb);

            resizeAndSave(req, res, errCb,
                sails.config.images.heroWidth, sails.config.images.heroHeight, gfs,
                function (fileName) {
                    console.log("Saved " + fileName);
                    resizeAndSave(req, res, errCb,
                        sails.config.images.thumbnailSize, sails.config.images.thumbnailSize, gfs, cb);
            });
        });

    }

};