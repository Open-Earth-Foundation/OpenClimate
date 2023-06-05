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
  db.addColumn("DataSource", "citation", {
    type: "string",
    length: 511,
    unique: false,
    notNull: false,
  });

exports.down = async (db) =>
  db.removeColumn("DataSource", "citation");

exports._meta = {
  "version": 1
};
