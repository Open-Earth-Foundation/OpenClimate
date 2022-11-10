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

exports.up = function(db) {
  db.createTable('trusted_registry', {
    id: {type: 'int', primaryKey: true, unique: true, autoIncrement: true},
    did: 'text',
    organization_name: 'text',
    created_at: 'timestamptz',
    updated_at: 'timestamptz',
  })
  return null;
};

exports.down = function(db) {
  db.dropTable('sites')
  return null;
};

exports._meta = {
  "version": 1
};
