'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = async (db) =>
  db.createTable("DataSourceQuality", {
    datasource_id: {
      type: "string",
      primaryKey: true,
      foreignKey: {
        name: "datasourcequality_datasource_datasource_id",
        table: "DataSource",
        rules: {
          onDelete: "CASCADE",
          onUpdate: "RESTRICT",
        },
        mapping: "datasource_id",
      },
    },
    score_type: {
      type: "string",
      primaryKey: true,
    },
    score: "real",
    notes: "text",
    created: "timestamptz",
    last_updated: "timestamptz",
  })

exports.down = async (db) =>
  db.dropTable("DataSourceQuality")

exports._meta = {
  "version": 1
};
