// MIT License
//
// Copyright (c) 2012 Universidad Politécnica de Madrid
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

// Copyright (C) <2019> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0

// This file is borrowed from lynckia/licode with some modifications.

'use strict';
var dataAccess = require('../data_access');
var logger = require('./../logger').logger;
var requestHandler = require('../requestHandler');
var e = require('../errors');

// Logger
var log = logger.getLogger('UsersResource');

/*
 * Post User. Creates a new user.
 */
exports.createUser = function (req, res, next) {
    if (typeof req.body !== 'object' || req.body === null ) {
        return next(new e.BadRequestError('Invalid request body'));
    }
    var options = req.body || {};
    dataAccess.user.create(options, function(err, result) {
        if (!err && result) {
            log.debug('User created:', result);
            res.send(result);
        } else {
            log.info('User creation failed', err ? err.message : options);
            next(err || new e.AppError('Create user failed'));
        }
    });
};

/*
 * Get users. Represent a list of user.
 */
exports.represent = function (req, res, next) {
    req.query.page = Number(req.query.page) || undefined;
    req.query.per_page = Number(req.query.per_page) || undefined;

    dataAccess.user.list(req.query, function (err, users) {
        if (users) {
            log.debug('Representing users');
            res.send(users);
        } else {
            next(err || new e.AppError('Get users failed'));
        }
    });
};
