'use strict';

import { methodologies } from "../seeders/methodologies.seeder";
import { pledges } from "../seeders/pledges.seeder";
import { providers } from "../seeders/providers.seeder";

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
  const sql   = 'DELETE FROM emissions_pledges'
  db.runSql(sql, function(err){
    if (err) return console.log(err)
  })
  const timestamp = new Date()
  const castedTimestamp = timestamp.toISOString()
  console.log('Seeding pledges...');
  
  pledges.map((p)=>(
    db.insert(
      'emissions_pledges',
      ['pledge_id','pledge_type', 'pledge_target_year', 'plegde_baseline_year','plegde_base_level_year','pledge_target', 'conditionality','region_name', 'created_at', 'updated_at'],
      [p.pledge_id , p.pledge_type, p.pledge_target_year, p.pledge_baseline_year, p.pledge_base_level, p.pledge_target, p.conditionality, p.region_name, castedTimestamp, castedTimestamp]
  )));

  return null;
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
