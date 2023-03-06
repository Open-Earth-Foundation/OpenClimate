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
      "delete from countries_to_subnationals c2s " +
        "where not exists (select * from subnationals s where s.subnational_id = c2s.subnational_id);"
    )
    .then(() => {
      // This should prevent adding c2s rows that don't have a matching s
      return db.addForeignKey(
        "countries_to_subnationals",
        "subnationals",
        "countries_to_subnationals_to_subnationals",
        {
          subnational_id: "subnational_id",
        },
        {
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        }
      );
    });
};

exports.down = function (db) {
  return db.removeForeignKey(
    "countries_to_subnationals",
    "countries_to_subnationals_to_subnationals",
    {
      dropIndex: true,
    }
  );
};

exports._meta = {
  version: 1,
};
