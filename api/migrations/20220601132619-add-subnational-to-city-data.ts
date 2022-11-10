'use strict';

import { subnationToCity } from "../seeders/subnational-city.seeder";

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
  const sql   = 'DELETE FROM subnationals_to_cities';
  db.runSql(sql, function(err){
    if (err) return console.log(err)
  });
  
  console.log('Seeding subnationals to cities...');
  
  subnationToCity.map((e)=>(
    db.insert(
      'subnationals_to_cities',
      ['subnational_id', 'city_id'],
      [e.subnation_id, e.entity_id]
  )));

  return null
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
