'use strict';

import { countires } from "../seeders/countries.seeder";

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
  const sql   = 'DELETE FROM countries'
  db.runSql(sql, function(err){
    if (err) return console.log(err)
  })
  const timestamp = new Date()
  const castedTimestamp = timestamp.toISOString()
  console.log('Seeding countries...');
  
  countires.map((c)=>(
    db.insert(
      'countries',
      ['country_id','country_name', 'iso', 'party_to_pa','flag_icon', 'created_at', 'updated_at'],
      [c.country_id, c.country_name, c.iso, c.party_to_pa, c.flag_icon, castedTimestamp, castedTimestamp]
  )));

  return null

};

exports.down = function(db) {
  const sql = 'DELETE FROM countries'
  db.runSql(sql, function (err) {
    if (err) return console.log(err)
  })
  return null;
};

exports._meta = {
  "version": 1
};
