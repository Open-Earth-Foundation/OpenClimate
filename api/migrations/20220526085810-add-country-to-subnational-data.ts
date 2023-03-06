"use strict";

import { cities } from "../seeders/cities.seeder";
import { countryToSubnational } from "../seeders/country-subnational.seeder";

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
  const sql = "DELETE FROM countries_to_subnationals";
  db.runSql(sql, function (err) {
    if (err) return console.log(err);
  });
  const timestamp = new Date();
  const castedTimestamp = timestamp.toISOString();
  console.log("Seeding countries to subnationals...");

  countryToSubnational.map((c) =>
    db.insert(
      "countries_to_subnationals",
      ["country_id", "subnational_id"],
      [c.country_id, c.subnational_id]
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
