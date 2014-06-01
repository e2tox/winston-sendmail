"use strict";

var util    = require('util');
var os      = require('os');
var winston = require('winston');
var mailer = require('nodemailer');

/**
 * @constructs Mail
 * @param {object} options hash of options
 */

var Mail = exports.Mail = function (options) {
    options = options || {};

    if (!options.to){
        throw 'winston-mail requires \'to\' property';
    }

    this.name       = 'mail';
    this.to         = options.to;
    this.from       = options.from                   || 'winston@' + os.hostname()
    this.level      = options.level                  || 'info';
    this.silent     = options.silent                 || false;

    this.handleExceptions = options.handleExceptions || false;

    this.server = mailer.createTransport(options.transport, options.options || {});

};

/** @extends winston.Transport */
util.inherits(Mail, winston.Transport);

//
// Expose the name of this Transport on the prototype
//
Mail.prototype.name = 'Mail';


Mail.prototype.log = function (level, msg, meta, callback) {
    var self = this;
    if (this.silent) return callback(null, true);

    var body = msg;

    // add meta info into the body if not empty
    if (meta !== null && meta !== undefined && (typeof meta !== 'object' || Object.keys(meta).length > 0))
        body += '\n\n' + util.inspect(meta, { depth: 7 }); // add some pretty printing

    var message = {
        from: this.from,
        to: this.to,
        subject: msg.split('\n')[0],
        text: body,
        attachments: []
    };

    if (meta.error && meta.error.stack) {
        message.attachments.push({   // utf-8 string as an attachment
            fileName: 'raw_error.txt',
            contents: meta.error.message + '\n' + meta.error.stack,
        });
    }

    if (meta.request && meta.request.payload) {
        message.attachments.push({   // utf-8 string as an attachment
            fileName: 'raw_request.txt',
            contents: meta.request.payload,
        });
    }

    if (meta.response && meta.response.payload) {
        message.attachments.push({   // utf-8 string as an attachment
            fileName: 'raw_response.txt',
            contents: meta.response.payload,
        });
    }

    this.server.sendMail(message, function(err, response) {
        if (err) {
            self.emit('error', err);
        }
        self.emit('logged');
        callback(null);
    });
};

module.exports = winston.transports.Mail = Mail;