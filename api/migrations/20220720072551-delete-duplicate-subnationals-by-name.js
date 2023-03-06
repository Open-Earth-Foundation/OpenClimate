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
  return db
    .runSql(
      "create temp table first_subnational_by_name as " +
        "select c.country_id, s.subnational_name, min(s.subnational_id) as first_id " +
        "from (countries c join countries_to_subnationals c2s on c.country_id = c2s.country_id) join subnationals s on c2s.subnational_id = s.subnational_id " +
        "group by c.country_id, s.subnational_name;"
    )
    .then(() => {
      return db.runSql(
        "create table duplicate_subnationals as " +
          "select * from subnationals s " +
          "where not exists (select f.first_id from first_subnational_by_name f where f.first_id = s.subnational_id);"
      );
    })
    .then(() => {
      return db.runSql(
        "delete from subnationals s " +
          "where not exists (select f.first_id from first_subnational_by_name f where f.first_id = s.subnational_id);"
      );
    });
};

exports.down = function (db) {
  return db
    .runSql(
      "insert into subnationals " + "select * from duplicate_subnationals"
    )
    .then(() => {
      return db.dropTable("duplicate_subnationals");
    });
};

exports._meta = {
  version: 1,
};
