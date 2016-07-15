/*global require, exports*/
'use strict';
var db = require('./dataBase').db;

var logger = require('./../logger').logger;

// Logger
var log = logger.getLogger('RoomRegistry');

var getRoom = exports.getRoom = function (id, callback) {
    db.rooms.findOne({_id: db.ObjectId(id)}, function (err, room) {
        if (room === undefined) {
            log.warn('Room ', id, ' not found');
        }
        if (callback !== undefined) {
            callback(room);
        }
    });
};

var hasRoom = exports.hasRoom = function (id, callback) {
    getRoom(id, function (room) {
        if (room === undefined) {
            callback(false);
        } else {
            callback(true);
        }
    });
};

/*
 * Adds a new room to the data base.
 */
exports.addRoom = function (room, callback) {
    db.rooms.save(room, function (error, saved) {
        if (error) log.warn('MongoDB: Error adding room: ', error);
        callback(saved);
    });
};

/*
 * Removes a determined room from the data base.
 */
exports.removeRoom = function (id, callback) {
    hasRoom(id, function (hasR) {
        if (hasR) {
            db.rooms.remove({_id: db.ObjectId(id)}, function (error, removed) {
                if (error) log.warn('MongoDB: Error romoving room: ', error);
                callback(removed);
            });
        }
    });
};

/*
 * Find rooms with SIP information
 */
exports.getRoomsWithSIP = function (callback) {
    var results = [];
    db.collection('rooms').find({'sipInfo': {$ne: null}}).forEach(function(err, room) {
        if (err) log.warn('MongoDB: Error getting SIP rooms: ', err);
        if (room) {
            results.push({room_id: room._id, sipInfo: room.sipInfo});
        } else {
            callback(results);
        }
    });
};

