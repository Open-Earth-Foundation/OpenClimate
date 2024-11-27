'use strict';

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

exports.up = async (db) =>
  db.createTable('LatestPopulation', {
    columns: {
      actor_id: {
        type: 'string',
        length: 255,
        primaryKey: true,
        foreignKey: {
          name: "latest_population_actor_actor_id_fk",
          table: "Actor",
          rules: {
            onDelete: 'CASCADE',
            onUpdate: 'RESTRICT',
          },
          mapping: "actor_id",
        },
      },
      year: { type: 'int' },
      population: { type: 'bigint' },
      created: { type: 'timestamp', notNull: true },
      last_updated: { type: 'timestamp', notNull: true },
      datasource_id: {
        type: 'string',
        length: 255,
        notNull: true,
        foreignKey: {
          name: 'latest_population_datasource_datasource_id_fk',
          table: 'DataSource',
          rules: {
            onDelete: 'CASCADE',
            onUpdate: 'RESTRICT',
          },
          mapping: 'datasource_id',
        },
      }
    },
  })

exports.down = async (db) =>
  db.dropTable('LatestPopulation')

exports._meta = {
  "version": 1
};
