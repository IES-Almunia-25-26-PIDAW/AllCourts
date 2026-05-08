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
    ALTER TABLE payments
    ADD COLUMN stripe_payment_intent_id VARCHAR(255) NULL UNIQUE
    COMMENT 'ID del PaymentIntent de Stripe, p.ej.: pi_3Qx... Usado para idempotencia y trazabilidad'
  `);
};

exports.down = function (db) {
	return db.runSql(`
    ALTER TABLE payments
    DROP COLUMN stripe_payment_intent_id
  `);
};

exports._meta = {
	version: 1,
};
