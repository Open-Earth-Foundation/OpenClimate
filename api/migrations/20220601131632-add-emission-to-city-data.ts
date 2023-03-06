"use strict";

import { emissionsToCity } from "../seeders/emission-city.seeder";

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db) {
  const sql = "DELETE FROM emissions_to_cities";
  db.runSql(sql, function (err) {
    if (err) return console.log(err);
  });

  console.log("Seeding emissions cities...");

  emissionsToCity.map((e) =>
    db.insert(
      "emissions_to_cities",
      ["city_id", "emission_id"],
      [e.entity_id, e.city_emissions_id]
    )
  );

  return null;
};

exports.down = function (db) {
  return null;
};

exports._meta = {
  version: 1,
};
