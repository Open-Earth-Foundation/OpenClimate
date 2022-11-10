'use strict';

import { cities } from "../seeders/cities.seeder";
import { countryToSubnational } from "../seeders/country-subnational.seeder";
import { emissionToCountry } from "../seeders/emission-country.seeder";

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
  const sql   = 'DELETE FROM emissions_to_countries';
  db.runSql(sql, function(err){
    if (err) return console.log(err)
  });
  const timestamp = new Date()
  const castedTimestamp = timestamp.toISOString()
  console.log('Seeding emissions countries...');
  
  emissionToCountry.map((e)=>(
    db.insert(
      'emissions_to_countries',
      ['country_id', 'emissions_id'],
      [e.country_id, e.emissions_id]
  )));

  return null
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
