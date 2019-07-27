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
var requestHandler = require('../requestHandler');
var logger = require('./../logger').logger;
var e = require('../errors');

// Logger
var log = logger.getLogger('UserResource');

/*
 * Get User. Represents a determined user.
 */
exports.represent = function (req, res, next) {
    dataAccess.user.get(req.params.user, function (err, user) {
        if (!user) {
            log.info('User ', req.params.user, ' does not exist');
            next(new e.NotFoundError('User not found'));
        } else {
            log.info('Representing user ', user._id);
            res.send(user);
        }
    });
};

/*
 * Delete User. Removes a determined user from the database and asks requestHandler to remove it from erizoController.
 */
exports.deleteUser = function (req, res, next) {
    dataAccess.user.get(req.params.user, function (err, user) {
        if (!user) {
            log.info('User ', req.params.user, ' does not exist');
            next(new e.NotFoundError('User not found'));
        } else {
            dataAccess.user.delete(req.params.user, function(err, user) {
                if (err) {
                  return next(err);
                } else {
                    var id = req.params.user;
                    log.debug('User ', id, ' is deleted');
                    //TODO delete participant
                    res.send('User deleted');
                }
            });
        }
    });
};

/*
 * Update User. update a determined user from the database
 */
exports.updateUser = function (req, res, next) {
    var updates = req.body;
    dataAccess.user.get(req.params.user, function (err, user) {
        if (!user) {
            log.info('User ', req.params.user, ' does not exist');
            next(new e.NotFoundError('User not found'));
        } else {
            var updates = req.body;
            dataAccess.user.update(req.params.user, updates, function(err, result) {
                if (result) {
                    res.send(result);
                } else {
                    next(new e.BadRequestError(err && err.message || 'Bad user configuration'));
                }
            });
        }
    });
};


/*
 * Login User. 
 */
exports.login = function (req, res, next) {
    var userName = req.body.user;
    var userPwd = req.body.pwd;
    log.debug('login by user', userName, userPwd);
    dataAccess.user.findUserByNameAndPwd(userName, userPwd, function (err, user) {
        if (err) {
            log.debug('find user by error ', err);
            return next(err);
        }
        log.debug('find user ', user);
        if (!user) {
            next(new e.NotFoundError('user not found'));
        /* } else if (user.loggedin) {
            next(new e.AppError('user has already logged in'), 400); */
        } else {           
            dataAccess.user.update(user._id, { loggedin : true }, function(err, result) {
                log.debug('update user ', result);
                if (result) {
                    res.send(result);
                } else {
                    next(new e.AppError('User login failed'), 400);
                }
            });               
        }
    });
}

/*
 * Logout User. 
 */
exports.logout = function (req, res, next) {
    var userId = req.body.user;
    dataAccess.user.get(userId, function (err, user) {
        if (err) {
            return next(err);
        }
        if (!user) {
            next(new e.NotFoundError('User not found'));
        } else if (!user.loggedin) {
            next(new e.AppError('User has already logged out'), 400);
        } else {
            dataAccess.user.update(UserId, { loggedin : false }, function(err, result) {
                if (result) {
                    res.send(result);
                    //TODO delete participant
                } else {
                    next(new e.AppError('User logout failed'), 400);
                }
            });               
        }
    });
}
