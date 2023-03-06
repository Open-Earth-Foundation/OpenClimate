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
  return db.createTable("emissions", {
    emissions_id: {
      type: "int",
      primaryKey: true,
      unique: true,
      autoIncrement: true,
    },
    actor_type: "text",
    total_ghg_co2e: "int",
    land_sinks: "int",
    other_gases: "int",
    dataset_did: "text",
    data_provider_id: "int",
    created_at: "timestamptz",
    updated_at: "timestamptz",
  });
};

exports.down = function (db) {
  return db.dropTable("emissions");
};

exports._meta = {
  version: 1,
};

// iso-3166

// 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
