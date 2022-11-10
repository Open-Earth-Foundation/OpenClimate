'use strict';

import path from "path";
import fsp from "fs/promises";

const tables = ["Tag", "DataSourceTag", "EmissionsAggTag"]

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

async function readSql(table) {
  const name = path.join(__dirname, '..', 'schema/SQL/' + table + ".sql");
  const sql = await fsp.readFile(name, {encoding: 'utf-8'})
  return sql;
}

exports.up = async function(db) {

  for (let table of tables) {
    let sql = await readSql(table)
    await db.runSql(sql)
  }

  return
};

exports.down = async function(db) {
  for (let table of tables) {
    await db.dropTable(table)
  }
  return
};

exports._meta = {
  "version": 1
};
