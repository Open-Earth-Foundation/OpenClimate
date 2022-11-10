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
  return db.createTable('schemas', {
    schema_id: {type: 'text', primaryKey: true, unique: true},
    name: 'text',
    version: 'text',
    protocol: 'text',
    sequence_number: 'int',
    origination: 'text',
    attribute_names: 'json',
  })
}

exports.down = function (db) {
  return db.dropTable('schemas')
}

exports._meta = {
  version: 1,
}
