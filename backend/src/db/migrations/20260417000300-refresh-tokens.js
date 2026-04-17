"use strict";

function runStatements(db, statements, callback) {
  let index = 0;

  function next(err) {
    if (err) {
      callback(err);
      return;
    }

    if (index >= statements.length) {
      callback();
      return;
    }

    const sql = statements[index];
    index += 1;

    db.runSql(sql, next);
  }

  next();
}

exports.up = function (db, callback) {
  const statements = [
    `CREATE TABLE IF NOT EXISTS refresh_tokens (
      id CHAR(36) PRIMARY KEY,
      user_id CHAR(36) NOT NULL,
      token_hash CHAR(64) NOT NULL UNIQUE,
      expires_at TIMESTAMP NOT NULL,
      revoked_at TIMESTAMP NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_refresh_tokens_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
      INDEX idx_refresh_user (user_id),
      INDEX idx_refresh_expires (expires_at)
    )`,
  ];

  runStatements(db, statements, callback);
};

exports.down = function (db, callback) {
  runStatements(db, ["DROP TABLE IF EXISTS refresh_tokens"], callback);
};
