// Copyright (C) <2019> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0

'use strict';
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var User = require('./../model/userModel');

/*
 * Create a user.
 */
exports.create = function (user, callback) {
  var userToCreate = {...user, userPwd: bcrypt.hashSync(user.userPwd, 8)}
  User.create(userToCreate, function (err, result) {
    callback(err, result._id);
  });
};

/*
 * Update User.
 */
exports.update = function (userId, updates, callback) {
  User.findById(userId).then((user) => {
    var newUser = Object.assign(user, updates, updates.hasOwnProperty("userPwd") ? {userPwd: bcrypt.hashSync(user.userPwd, 8)} : null);
    return newUser.save();
  }).then((saved) => {
    callback(null, saved.toObject());
  }).catch((err) => {
    callback(err, null);
  });
};

/*
 * Delete a user.
 */
exports.delete = function (userId, callback) {
  User.remove({_id: userId}, function(err, ret) {
    if (ret.n === 0) userId = null;
    callback(err, userId);
  });
};

/*
 * List user.
 */
exports.list = function (options, callback) {
  var popOption = {
    path: 'users',
    options: { sort: {_id: 1} }
  };
  if (options) {
    if (typeof options.per_page === 'number' && options.per_page > 0) {
      popOption.options.limit = options.per_page;
      if (typeof options.page === 'number' && options.page > 0) {
        popOption.options.skip = (options.page - 1) * options.per_page;
      }
    }
  }
  User.find().populate(popOption).lean().exec(function (err, users) {
    callback(err, users);
  });
};

/*
 * Get a user
 */
exports.get = function (userId, callback) {
  User.findById(userId).lean().exec(function (err, user) {
    callback(err, user);
  });
};

/*
 * Get a user by user name and password
 */
exports.findUserByNameAndPwd = function (name, password, callback) {
  User.findOne({userName: name}).lean().exec(function (err, user) {   //TODO need to add password validate
    callback(err, user);
  });
};

/*
 * Validate a user's pwd
 */
exports.validatePwd = function (decryptedPwd, encryptedPwd, callback) {
  if ( encryptedPwd === bcrypt.hashSync(user.userPwd, 8)) {
    callback(true);  
  } else {
    callback(false);
  }
};

