"use strict";

import path from "path";
import fsp from "fs/promises";

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

exports.up = async function (db) {
  return db.createTable("Target", {
    target_id: { type: "string", length: 255, primaryKey: true },
    actor_id: {
      type: "string",
      length: 255,
      foreignKey: {
        name: "FK_Target.actor_id",
        table: "Actor",
        rules: {
          onDelete: "CASCADE",
          onUpdate: "RESTRICT",
        },
        mapping: "actor_id",
      },
    },
    target_type: { type: "string", length: 255 },
    baseline_year: { type: "int" },
    target_year: { type: "int" },
    baseline_value: { type: "bigint" },
    target_value: { type: "bigint" },
    target_unit: { type: "string", length: 255 },
    bau_value: { type: "int" },
    is_net_zero: { type: "boolean" },
    percent_achieved: { type: "int" },
    URL: { type: "string", length: 255 },
    summary: { type: "string", length: 255 },
    datasource_id: {
      type: "string",
      length: 255,
      foreignKey: {
        name: "FK_Target.datasource_id",
        table: "DataSource",
        rules: {
          onDelete: "CASCADE",
          onUpdate: "RESTRICT",
        },
        mapping: "datasource_id",
      },
    },
    created: { type: "timestamptz" },
    last_updated: { type: "timestamptz" },
  });
};

exports.down = async function (db) {
  return db.dropTable("Target");
};

exports._meta = {
  version: 1,
};
