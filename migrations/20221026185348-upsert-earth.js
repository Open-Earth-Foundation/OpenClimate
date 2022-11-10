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

exports.up = async function(db) {
  return db.runSql(
    `
    INSERT INTO "Actor" (actor_id, type, name, created, last_updated)
    VALUES ('EARTH', 'planet', 'Earth', NOW(), NOW())
    ON CONFLICT (actor_id)
    DO UPDATE SET (type, name, last_updated) = (EXCLUDED.type, EXCLUDED.name, EXCLUDED.last_updated)
    `
  )
};

exports.down = async function(db) {
  return db.runSQL(
    `
    DELETE FROM "Actor" WHERE actor_id = 'EARTH'
    `
  )
};

exports._meta = {
  "version": 1
};
