"use strict";

import { emissions } from "../seeders/emissions.seeder";

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

exports.up = (db) =>
  db
    .addColumn("emissions", "year", { type: "int" })
    .then(() =>
      Promise.all(
        emissions.map((e) =>
          db.runSql("UPDATE emissions SET year = ? WHERE emissions_id = ?", [
            e.year,
            e.emissions_id,
          ])
        )
      )
    );

exports.down = (db) => db.removeColumn("emissions", "year");

exports._meta = {
  version: 1,
};
