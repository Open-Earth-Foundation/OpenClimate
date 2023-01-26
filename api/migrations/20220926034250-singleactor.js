"use strict";

import path from "path";
import fsp from "fs/promises";

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

async function readSql(table) {
  const name = path.join(__dirname, "..", "schema/SQL/" + table + ".sql");
  const sql = await fsp.readFile(name, { encoding: "utf-8" });
  return sql;
}

exports.up = async function (db) {
  let sql = await readSql("Publisher");
  await db.runSql(sql);
  sql = await readSql("DataSource");
  await db.runSql(sql);
  sql = await readSql("Actor");
  await db.runSql(sql);
  sql = await readSql("ActorName");
  await db.runSql(sql);
  sql = await readSql("ActorIdentifier");
  await db.runSql(sql);
  return;
};

exports.down = async function (db) {
  await db.dropTable("ActorIdentifier");
  await db.dropTable("ActorName");
  await db.dropTable("Actor");
  await db.dropTable("DataSource");
  await db.dropTable("Publisher");
  return;
};

exports._meta = {
  version: 1,
};
