'use strict';

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

// We add an index for the name column in the ActorName table
// to enable prefix search (LIKE 'prefix%') on the name column.
// addIndex() doesn't allow adding an index with a custom operator class
// so we use runSql() here

exports.up = async (db) =>
  db.runSql(`
    CREATE INDEX actorname_name_search_idx
    ON "ActorName"
    (name varchar_pattern_ops);
  `)

exports.down = async (db) =>
  db.removeIndex('ActorName', 'actorname_name_search_idx');

exports._meta = {
  "version": 1
};
