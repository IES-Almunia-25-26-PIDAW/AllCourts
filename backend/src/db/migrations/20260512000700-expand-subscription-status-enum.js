"use strict";

var dbm;
var type;
var seed;

exports.setup = function (options, seedLink) {
	dbm = options.dbmigrate;
	type = dbm.dataType;
	seed = seedLink;
};

exports.up = function (db) {
	return db.runSql(`
    ALTER TABLE managers
    MODIFY COLUMN subscription_status ENUM('inactive', 'incomplete', 'active', 'past_due', 'canceled', 'incomplete_expired', 'trialing', 'unpaid', 'paused') NOT NULL DEFAULT 'inactive'
  `);
};

exports.down = function (db) {
	return db.runSql(`
    ALTER TABLE managers
    MODIFY COLUMN subscription_status ENUM('inactive', 'active', 'past_due', 'canceled') NOT NULL DEFAULT 'inactive'
  `);
};

exports._meta = {
	version: 1,
};