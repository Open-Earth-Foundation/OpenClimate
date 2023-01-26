"use strict";

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db) {
  db.createTable("proofs", {
    id: { type: "int", primaryKey: true, unique: true, autoIncrement: true },
    user_id: "int",
    cred_def_id: "text",
    created_at: "timestamptz",
    updated_at: "timestamptz",
  });
  return null;
};

exports.down = function (db) {
  db.dropTable("proofs");
  return null;
};

exports._meta = {
  version: 1,
};
