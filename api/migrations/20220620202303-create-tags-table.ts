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
  return db.createTable('tags',{
    tag_id: {
      type: 'int',
      primaryKey:true,
      unique: true,
      autoIncrement: true,
    },
    tag_name: 'text',
    created_at: 'timestamptz',
    updated_at: 'timestamptz'
  })
};

exports.down = function(db) {
  return db.dropTable('tags');
};

exports._meta = {
  "version": 1
};
