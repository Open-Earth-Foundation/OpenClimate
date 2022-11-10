'use strict'

var dbm
var type
var seed

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate
  type = dbm.dataType
  seed = seedLink
}

exports.up = function (db) {
  return db.createTable('contacts', {
    contact_id: {type: 'int', primaryKey: true, autoIncrement: true},
    label: 'string',
    created_at: 'timestamptz',
    updated_at: 'timestamptz',
    meta_data: 'json',
  })
}

exports.down = function (db) {
  return db.dropTable('contacts')
}

exports._meta = {
  version: 1,
}
