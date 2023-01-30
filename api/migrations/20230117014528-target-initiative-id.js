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

exports.up = async function(db) {

  // evanp: I screwed up and ran SQL scripts that change
  // for the single-actor schema, so changes to that schema have
  // to be handled carefully :( These might already
  // exist.

  const results = await db.runSql('SELECT * FROM "Target" WHERE 1 = 0')

  if (!results.fields.find((f) => f.name == "initiative_id")) {
    await db.addColumn('Target', 'initiative_id', {
        type: 'string',
        length: 255,
        unique: false,
        notNull: false,
        foreignKey: {
          name: 'FK_Target.initiative_id',
          table: 'Initiative',
          rules: {
            onDelete: 'CASCADE',
            onUpdate: 'RESTRICT'
          },
          mapping: 'initiative_id'
        }
      }
    )
  }
};

exports.down = async function(db) {
  return db.removeColumn('Target', 'initiative_id')
};

exports._meta = {
  "version": 1
};
