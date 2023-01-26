"use strict";

import { subnationals } from "../seeders/subnationals.seeder";

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
  const sql = "DELETE FROM subnationals";
  db.runSql(sql, function (err) {
    if (err) return console.log(err);
  });

  const timestamp = new Date();
  const castedTimestamp = timestamp.toISOString();
  console.log("Seeding subnationals...");

  subnationals.map((s) =>
    db.insert(
      "subnationals",
      [
        "subnational_id",
        "subnational_name",
        "entity_type",
        "spacial_polygon",
        "flag_icon",
        "created_at",
        "updated_at",
      ],
      [
        s.subnational_id,
        s.subnational_name,
        s.entity_type,
        s.spacial_polygon,
        s.flag_icon,
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
