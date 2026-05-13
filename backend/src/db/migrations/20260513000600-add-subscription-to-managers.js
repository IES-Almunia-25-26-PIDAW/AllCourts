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
    ADD COLUMN stripe_customer_id VARCHAR(255) NULL,
    ADD COLUMN stripe_subscription_id VARCHAR(255) NULL
  `);
};

exports.down = function (db) {
	return db.runSql(`
    ALTER TABLE managers
    DROP COLUMN stripe_subscription_id,
    DROP COLUMN stripe_customer_id
  `);
};

exports._meta = {
	version: 1,
};