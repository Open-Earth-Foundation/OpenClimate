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

// On up, convert total_ghg_co2e to a bigint to handle values > 2 billion :(

exports.up = function (db) {
  return db
    .changeColumn("emissions", "total_ghg_co2e", { type: "bigint" })
    .then(() => {
      // PRIMAP source data is in kilotonnes; need to scale to tonnes
      const primap = emissions.filter((e) => e.dataprovider_id == 1);
      return Promise.all(
        primap.map((e) => {
          return db.runSql(
            `UPDATE emissions SET total_ghg_co2e = ? WHERE emissions_id = ?`,
            [Math.round(e.total_ghg_co2e * 1000), e.emissions_id]
          );
        })
      );
    });
};

// On down, convert total_ghg_co2e to an int

exports.down = function (db) {
  const primap = emissions.filter((e) => e.dataprovider_id == 1);
  return Promise.all(
    primap.map((e) => {
      // Scale PRIMAP data back down to kilotonnes
      return db.runSql(
        `UPDATE emissions SET total_ghg_co2e = ? WHERE emissions_id = ?`,
        [Math.round(e.total_ghg_co2e), e.emissions_id]
      );
    })
  ).then(() => {
    return db.changeColumn("emissions", "total_ghg_co2e", { type: "int" });
  });
};

exports._meta = {
  version: 1,
};
