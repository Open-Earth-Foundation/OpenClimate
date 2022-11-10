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
  return db.createTable('cities', {
    city_id: {
      type: 'int',
      primaryKey:true,
      unique: true,
      autoIncrement: true,
    },
    city_name: 'text',
    spacial_polygon: 'text',
    flag_icon: 'text',
    created_at: 'timestamptz',
    updated_at: 'timestamptz'
  });
};

exports.down = function(db) {
  return db.dropTable('cities');
};

exports._meta = {
  "version": 1
};
