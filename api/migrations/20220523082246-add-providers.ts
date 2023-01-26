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
  return db.createTable("dataproviders", {
    data_provider_id: {
      type: "int",
      priimaryKey: true,
      unique: true,
      autoIncrement: true,
    },
    data_provider_name: "text",
    data_provider_type: "text",
    verified: "boolean",
    data_signer: "text",
    provider_did: "text",
    file_integration: "text",
    data_provider_link: "text",
    created_at: "timestamptz",
    updated_at: "timestamptz",
  });
};

exports.down = function (db) {
  return db.dropTable("dataproviders");
};

exports._meta = {
  version: 1,
};
