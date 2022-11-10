'use strict';

import { cities } from "../seeders/cities.seeder";

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

exports.up = (db) =>
  db.addColumn('cities', 'country_iso', { type: 'string', length: 3 } )
  .then(() =>
    Promise.all(cities.map((c) => db.runSql("UPDATE cities SET country_iso = ? WHERE city_id = ?", [c.country_iso, c.entiy_id]))) 
  )

exports.down =  (db) =>
  db.removeColumn('cities', 'country_iso')

exports._meta = {
  "version": 1
};
