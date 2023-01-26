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

exports.up = async (db) =>
  db.createTable("Initiative", {
    initiative_id: { type: "string", length: 255, primaryKey: true },
    name: { type: "string", length: 255 },
    description: { type: "text" },
    URL: { type: "string", length: 255 },
    datasource_id: {
      type: "string",
      length: 255,
      foreignKey: {
        name: "FK_Initiative.datasource_id",
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

exports.down = async (db) => db.dropTable("Initiative");

exports._meta = {
  version: 1,
};
