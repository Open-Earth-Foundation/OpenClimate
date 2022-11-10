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
  return db.createTable('emissions_pledges', {
    pledge_id: {
      type: 'int',
      primaryKey:true,
      unique: true,
      autoIncrement: true,
    },
    pledge_type: 'text',
    pledge_target_year: 'int',
    plegde_baseline_year: 'int',
    plegde_base_level_year: 'int',
    pledge_target: 'int',
    conditionality: 'int',
    region_name: 'text',
    created_at: 'timestamptz',
    updated_at: 'timestamptz'
  });
};

exports.down = function(db) {
  return db.dropTable('emissions_pledges');
};

exports._meta = {
  "version": 1
};
