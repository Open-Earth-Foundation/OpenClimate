'use strict';

import { emissionToSubnation } from "../seeders/emission-subnational.seeder";

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
  const sql   = 'DELETE FROM emissions_to_subnationals';
  db.runSql(sql, function(err){
    if (err) return console.log(err)
  });
  const timestamp = new Date()
  console.log('Seeding emissions subnationals...');
  
  emissionToSubnation.map((e)=>(
    db.insert(
      'emissions_to_subnationals',
      ['subnational_id', 'emission_id'],
      [e.entiry_id, e.subnational_emissions_id]
  )));

  return null;
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};


