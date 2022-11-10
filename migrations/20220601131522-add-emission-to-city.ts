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
  console.log('creating emissions to cities')
  return db.createTable('emissions_to_cities', {
    city_id: {
      type: 'int',
      primaryKey:true,
    },

    emission_id: {
      type: 'int',
      primaryKey:true,
    },
    
  });
};

exports.down = function(db) {
  return db.dropTable('emissions_to_cities');
};

exports._meta = {
  "version": 1
};
