"use strict";

import { providers } from "../seeders/providers.seeder";

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
  const sql = "DELETE FROM dataproviders";
  db.runSql(sql, function (err) {
    if (err) return console.log(err);
  });
  const timestamp = new Date();
  const castedTimestamp = timestamp.toISOString();
  console.log("Seeding providers...");

  providers.map((p) =>
    db.insert(
      "dataproviders",
      [
        "data_provider_id",
        "data_provider_name",
        "data_provider_type",
        "verified",
        "data_signer",
        "provider_did",
        "file_integration",
        "data_provider_link",
        "created_at",
        "updated_at",
      ],
      [
        p.data_provider_id,
        p.provider_name,
        p.provider_type,
        p.verified,
        p.data_signer,
        p.provider_did,
        p.file_integration,
        p.data_provider_link,
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
