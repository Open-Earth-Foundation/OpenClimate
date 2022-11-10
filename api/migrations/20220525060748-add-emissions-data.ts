'use strict';

import { emissions } from "../seeders/emissions.seeder";

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
  const sql   = 'DELETE FROM emissions';
  db.runSql(sql, function(err){
    if (err) return console.log(err)
  });
  const timestamp = new Date()
  const castedTimestamp = timestamp.toISOString()
  console.log('Seeding emissions...');
  
  emissions.map((e)=>(
    db.insert(
      'emissions',
      ['emissions_id','actor_type', 'total_ghg_co2e','land_sinks', 'other_gases', 'dataset_did', 'data_provider_id', 'created_at', 'updated_at'],
      [e.emissions_id, e.actor_type, e.total_ghg_co2e, e.land_sinks, e.other_gases, e.dataset_did, e.dataprovider_id, castedTimestamp, castedTimestamp]
  )));

  return null;
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
