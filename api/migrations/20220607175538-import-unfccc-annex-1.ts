'use strict';

import { countires } from "../seeders/countries.seeder";
import { emissions } from "../seeders/emissions.seeder";

const countries = countires;
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

var dbm;
var type;
var seed;

const UNFCCC_DATA_PROVIDER_ID = 3;
const UNFCCC_ANNEX_1_CSV = path.join(__dirname, '..', 'upstream-data/unfccc-annex-1/historical_emissions.csv');

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = async function(db) {
  return db.insert(
    'dataproviders',
    ['data_provider_id', 'data_provider_name', 'verified', 'data_provider_link', 'created_at', 'updated_at'],
    [UNFCCC_DATA_PROVIDER_ID, "UNFCCC Annex I", true, "https://di.unfccc.int/time_series", (new Date()).toISOString(), (new Date()).toISOString()]
  )
  .then(() => {
    const maxEmissionsId = Math.max(...emissions.map(em => em.emissions_id))
    let nextEmissionsId = maxEmissionsId
    return new Promise((resolve, reject) => {
      let proms = []
      fs.createReadStream(UNFCCC_ANNEX_1_CSV)
      .pipe(csv())
      .on('data', (data) => {
        let country = countries.find((c) => c.country_name === data['Country'])
        if (country) {
          for (let year = 1990; year <= 2019; year++) {
            nextEmissionsId += 1;
            proms.push(
              insertEmissionsData(db, nextEmissionsId, country, data, year)
            )
          }
        }
      })
      .on('error', (err) => {
        reject(err)
      })
      .on('end', () => {
        Promise.all(proms).then(resolve)
      })
    })
  })
};

exports.down = function(db) {
  return db.runSql(`DELETE from emissions_to_countries WHERE emissions_id in (SELECT emissions_id FROM emissions WHERE data_provider_id = ${UNFCCC_DATA_PROVIDER_ID})`)
  .then(() => {
    return db.runSql(`DELETE FROM emissions WHERE data_provider_id = ${UNFCCC_DATA_PROVIDER_ID}`)
  })
  .then(() => {
    return db.runSql(`DELETE FROM dataproviders where data_provider_id = ${UNFCCC_DATA_PROVIDER_ID}`)
  })
};

exports._meta = {
  "version": 1
};

function insertEmissionsData(db, emissionsId, country, data, year) {

  let value = parseFloat(data[year.toString()]);
  let total_ghg_co2e = null;
  let land_sinks = null;

  if (data['Sector'] == 'Total GHG emissions without LULUCF') {
    total_ghg_co2e = value * 1000000;
  } else if (data['Sector'] == "Land Use, Land-Use Change and Forestry") {
    land_sinks = value * 1000000;
  } else {
    throw new Error("Unexpected sector: " + data['Sector'])
  }

  return db.insert(
    'emissions',
    ['emissions_id','actor_type', 'total_ghg_co2e','land_sinks', 'data_provider_id', 'year', 'created_at', 'updated_at'],
    [emissionsId, 'country', total_ghg_co2e, land_sinks, UNFCCC_DATA_PROVIDER_ID, year, (new Date()).toISOString(), (new Date()).toISOString()]
  )
  .then(() => {
    return db.insert(
      'emissions_to_countries',
      ['country_id', 'emissions_id'],
      [country.country_id, emissionsId]
    )
  })
}