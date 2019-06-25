// Copyright (C) <2019> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0

'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  userName: { type: String, minlength: 3, maxlength: 10 },
  userPwd: String,
  realName: { type: String, minlength: 3, maxlength: 10, default: '' },
  userAvatar: { type: String, default: '' },
  userLevel: {
    type: Number,
    enum : [1,2,3,4], // 1-teacher, 2-room owner, 3-admin, 4-member
    default: 4
  },
  rooms: [], //[{ type: Schema.Types.ObjectId, ref: 'Room' }],
  loggedin: { type: Boolean, default: false },
  userStatus: {
    type: Number,
    enum : [1,2], // 1-active, 2-inactive
    default: 1
  },
  creationDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
