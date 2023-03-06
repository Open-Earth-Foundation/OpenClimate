"use strict";

import { cities } from "../seeders/cities.seeder";

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
  const sql = "DELETE FROM cities";
  db.runSql(sql, function (err) {
    if (err) return console.log(err);
  });
  const timestamp = new Date();
  const castedTimestamp = timestamp.toISOString();
  console.log("Seeding cities...");

  cities.map((c) =>
    db.insert(
      "cities",
      [
        "city_id",
        "city_name",
        "spacial_polygon",
        "flag_icon",
        "created_at",
        "updated_at",
      ],
      [
        c.entiy_id,
        c.city_name,
        c.spacial_polygon,
        c.flag_icon,
        castedTimestamp,
        castedTimestamp,
      ]
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
