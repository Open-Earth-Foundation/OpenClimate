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
  console.log("creating countires");
  return db.createTable("countries", {
    country_id: {
      type: "int",
      primaryKey: true,
      unique: true,
      // autoIncrement: true,
    },
    country_name: {
      type: "text",
    },
    iso: "text",
    party_to_pa: "text",
    flag_icon: "text",
    created_at: "timestamptz",
    updated_at: "timestamptz",
  });
};

exports.down = function (db) {
  return db.dropTable("countries");
};

exports._meta = {
  version: 1,
};
