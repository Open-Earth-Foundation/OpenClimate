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
  return db.createTable("methodologies", {
    methodology_id: {
      type: "int",
      primaryKey: true,
      unique: true,
      autoIncrement: true,
    },
    dataset_name: "text",
    date_update: "date",
    methodology_type: "text",
    methodology_link: "text",
    data_provider_id: "text",
    created_at: "timestamptz",
    updated_at: "timestamptz",
  });
};

exports.down = function (db) {
  return db.dropTable("methodologies");
};

exports._meta = {
  version: 1,
};
