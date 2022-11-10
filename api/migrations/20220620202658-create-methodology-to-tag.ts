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
  db.createTable('methodology_to_tags',{
    methodology_id: {
      type: 'int',
      primaryKey:true,
      autoIncrement: true,
    },
    tag_id: {
      type: 'int',
      primaryKey:true,
      autoIncrement: true,
    },
  })
  return null;
};

exports.down = function(db) {
  return db.dropTable('methodology_to_tags');
};

exports._meta = {
  "version": 1
};
