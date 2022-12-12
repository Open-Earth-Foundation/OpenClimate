'use strict';

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

exports.up = async (db) =>
  db.createTable('ActorDataCoverage', {
    actor_id: {
    type: 'string',
    primaryKey: true,
    foreignKey: {
      name: 'actordatacoverage_actor_actor_id',
      table: 'Actor',
      rules: {
        onDelete: 'CASCADE',
        onUpdate: 'RESTRICT'
      },
      mapping: 'actor_id'
    }
  },
  has_data: 'boolean',
  has_children: 'boolean',
  children_have_data: 'boolean',
  created_at: 'timestamptz',
  updated_at: 'timestamptz'
})

exports.down = async (db) =>
  db.dropTable('ActorDataCoverage')

exports._meta = {
  "version": 1
};
