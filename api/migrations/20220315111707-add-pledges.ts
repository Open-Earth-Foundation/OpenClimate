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

exports.up = function (db) {
  db.createTable("pledges", {
    pledge_id: {
      type: "int",
      primaryKey: true,
      unique: true,
      autoIncrement: true,
    },
    credential_category: "text",
    credential_type: "text",
    credential_schema_id: "text",
    credential_issuer: "text",
    credential_issue_date: "timestamptz",
    organization_id: "int",
    organization_name: "text",
    organization_category: "text",
    organization_type: "text",
    organization_credential_id: "text",
    pledge_target_year: "int",
    pledge_emission_target: "int",
    pledge_emission_reduction: "int",
    pledge_carbon_intensity_target: "int",
    pledge_carbon_intensity_reduction: "int",
    pledge_base_year: "int",
    pledge_base_level: "int",
    pledge_plan_details: "text",
    pledge_public_statement: "text",
    signature_name: "text",
    created_at: "timestamptz",
    updated_at: "timestamptz",
  });
  return null;
};

exports.down = function (db) {
  db.dropTable("pledges");
  return null;
};

exports._meta = {
  version: 1,
};
