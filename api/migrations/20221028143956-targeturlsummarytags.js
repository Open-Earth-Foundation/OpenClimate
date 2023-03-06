"use strict";

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

exports.up = async function (db) {
  // evanp: I screwed up and ran SQL scripts that change
  // for the single-actor schema, so changes to that schema have
  // to be handled carefully :( These might already
  // exist.

  const results = await db.runSql('SELECT * FROM "Target" WHERE 1 = 0');

  if (!results.fields.find((f) => f.name == "URL")) {
    await db.addColumn("Target", "URL", {
      type: "string",
      length: 255,
      unique: false,
      notNull: false,
    });
  }

  if (!results.fields.find((f) => f.name == "summary")) {
    await db.addColumn("Target", "summary", {
      type: "string",
      length: 255,
      unique: false,
      notNull: false,
    });
  }

  await db.createTable("TargetTag", {
    target_id: {
      type: "string",
      length: 255,
      unique: false,
      notNull: true,
      primaryKey: true,
    },
    tag_id: {
      type: "string",
      length: 255,
      unique: false,
      notNull: true,
      primaryKey: true,
    },
    created: { type: "timestamp" },
    last_updated: { type: "timestamp" },
  });
};

exports.down = async function (db) {
  await db.dropTable("TargetTag");
  await db.removeColumn("Target", "summary");
  await db.removeColumn("Target", "URL");
};

exports._meta = {
  version: 1,
};
