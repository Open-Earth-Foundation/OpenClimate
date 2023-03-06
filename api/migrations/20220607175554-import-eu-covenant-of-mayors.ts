"use strict";

import { countires } from "../seeders/countries.seeder";
import { cities } from "../seeders/cities.seeder";
import { emissions } from "../seeders/emissions.seeder";
import { pledges } from "../seeders/pledges.seeder";
import { idText } from "typescript";
import { assert } from "console";

const countries = countires;

const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");

var dbm;
var type;
var seed;

const GCOM_PROVIDER_ID = 4;
const GCOM_CSV = path.join(
  __dirname,
  "..",
  "upstream-data/eu-covenant-of-mayors/EUCovenantofMayors2022_clean_NCI_Apr22.csv"
);

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = async function (db) {
  return db
    .insert(
      "dataproviders",
      [
        "data_provider_id",
        "data_provider_name",
        "verified",
        "data_provider_link",
        "created_at",
        "updated_at",
      ],
      [
        GCOM_PROVIDER_ID,
        "Global Covenant of Mayors",
        true,
        "https://di.unfccc.int/time_series",
        new Date().toISOString(),
        new Date().toISOString(),
      ]
    )
    .then(() => {
      return new Promise((resolve, reject) => {
        let gcom = new Map();
        let lines = 0;
        fs.createReadStream(GCOM_CSV)
          .pipe(csv())
          .on("data", (data) => {
            lines += 1;
            if (data.entity_type === "City") {
              if (!(data.GCoM_ID in gcom)) {
                gcom.set(data.GCoM_ID, {
                  name: data.name,
                  iso: data.iso,
                  pledges: [],
                  emissions: [],
                });
                if (
                  data.baseline_emissions !== "NA" &&
                  data.baseline_year !== "NA"
                ) {
                  gcom.get(data.GCoM_ID).emissions.push({
                    year: parseInt(data.baseline_year),
                    emissions: parseFloat(data.baseline_emissions),
                  });
                }
                if (
                  data.total_co2_emissions !== "NA" &&
                  data.total_co2_emissions_year !== "NA"
                ) {
                  gcom.get(data.GCoM_ID).emissions.push({
                    year: parseInt(data.total_co2_emissions_year),
                    emissions: parseFloat(data.total_co2_emissions),
                  });
                }
              }
              if (
                data.percent_reduction !== "NA" &&
                data.baseline_year !== "NA" &&
                data.baseline_emissions !== "NA" &&
                data.target_year !== "NA"
              ) {
                gcom.get(data.GCoM_ID).pledges.push({
                  baseline_year: parseInt(data.baseline_year),
                  baseline_emissions: parseFloat(data.baseline_emissions),
                  target_year: parseInt(data.target_year),
                  percent_reduction: parseInt(data.percent_reduction),
                  type: data.ghg_reduction_target_type,
                });
              }
            }
          })
          .on("error", (err) => {
            reject(err);
          })
          .on("end", () => {
            console.log("Handled %d lines of data", lines);
            const maxEmissionsId = Math.max(
              ...emissions.map((em) => em.emissions_id)
            );
            let nextEmissionsId = maxEmissionsId + 30 * 90 + 1;
            const maxCityId = Math.max(...cities.map((city) => city.entiy_id));
            let nextCityId = maxCityId + 1;
            const maxPledgeId = Math.max(...pledges.map((p) => p.pledge_id));
            let nextPledgeId = maxPledgeId + 1;
            let proms = [];
            for (const [id, city] of gcom) {
              // TODO: This is not sufficiently unique
              let known = cities.find(
                (c) => c.city_name == city.name && c.country_iso == city.iso
              );
              if (known) {
                proms.push(
                  insertKnownCity(
                    db,
                    known.entiy_id,
                    city,
                    nextEmissionsId,
                    nextPledgeId
                  )
                );
              } else {
                proms.push(
                  insertNewCity(
                    db,
                    city,
                    nextCityId,
                    nextEmissionsId,
                    nextPledgeId
                  )
                );
                nextCityId += 1;
              }
              nextEmissionsId += city.emissions.length;
              nextPledgeId += city.pledges.length;
            }
            console.log("Handling %d promises", proms.length);
            Promise.all(proms).then(resolve);
          });
      });
    });
};

// TODO: we need to delete pledges and cities also

exports.down = function (db) {
  return db
    .runSql(
      `DELETE from emissions_to_cities WHERE emission_id in (SELECT emissions_id FROM emissions WHERE data_provider_id = ${GCOM_PROVIDER_ID})`
    )
    .then(() => {
      return db.runSql(
        `DELETE FROM emissions WHERE data_provider_id = ${GCOM_PROVIDER_ID}`
      );
    })
    .then(() => {
      return db.runSql(
        `DELETE FROM dataproviders where data_provider_id = ${GCOM_PROVIDER_ID}`
      );
    });
};

exports._meta = {
  version: 1,
};

function insertKnownCity(db, city_id, city, nextEmissionsId, nextPledgeId) {
  return Promise.all([
    insertEmissionsData(db, city_id, city, nextEmissionsId),
    insertPledgeData(db, city_id, city, nextPledgeId),
  ]);
}

function insertPledgeData(db, city_id, city, pledge_id_base) {
  return Promise.all(
    city.pledges.map((pledge, i) => {
      return insertEmissionsPledge(db, city_id, pledge, pledge_id_base + i);
    })
  );
}

function insertEmissionsData(db, city_id, city, emissions_id_base) {
  return Promise.all(
    city.emissions.map((emissions, i) => {
      return insertEmissionsForYear(
        db,
        emissions,
        city_id,
        emissions_id_base + i
      );
    })
  );
}

function insertEmissionsForYear(db, emissions, city_id, emissions_id) {
  return db
    .insert(
      "emissions",
      [
        "emissions_id",
        "total_ghg_co2e",
        "data_provider_id",
        "year",
        "actor_type",
        "created_at",
        "updated_at",
      ],
      [
        emissions_id,
        emissions.emissions,
        GCOM_PROVIDER_ID,
        emissions.year,
        "city",
        new Date().toISOString(),
        new Date().toISOString(),
      ]
    )
    .then(() => {
      return db.insert(
        "emissions_to_cities",
        ["city_id", "emission_id"],
        [city_id, emissions_id]
      );
    });
}

function insertEmissionsPledge(db, city_id, pledge, pledge_id) {
  let pledge_target =
    (1.0 - pledge.percent_reduction / 100.0) * pledge.baseline_emissions;
  return db.insert(
    "emissions_pledges",
    [
      "pledge_id",
      "pledge_type",
      "pledge_target_year",
      "plegde_baseline_year",
      "plegde_base_level_year",
      "pledge_target",
      "conditionality",
      "region_name",
      "created_at",
      "updated_at",
    ],
    [
      pledge_id,
      pledge.type === "NA" ? null : pledge.type,
      pledge.target_year,
      pledge.baseline_year,
      pledge.baseline_emissions,
      pledge_target,
      null,
      null,
      new Date().toISOString(),
      new Date().toISOString(),
    ]
  );
}

function insertNewCity(db, city, city_id, emissions_id, pledge_id) {
  return db
    .insert(
      "cities",
      ["city_id", "city_name", "country_iso", "created_at", "updated_at"],
      [
        city_id,
        city.name,
        city.iso,
        new Date().toISOString(),
        new Date().toISOString(),
      ]
    )
    .then(() => {
      return insertKnownCity(db, city_id, city, emissions_id, pledge_id);
    });
}
