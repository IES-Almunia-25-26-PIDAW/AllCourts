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
    ALTER TABLE courts ADD COLUMN is_indoor BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'TRUE = pista cubierta / FALSE = pista al aire libre' AFTER description
  `);
};

exports.down = function (db) {
	return db.runSql(`
    ALTER TABLE courts DROP COLUMN is_indoor
  `);
};

exports._meta = {
	version: 1,
};