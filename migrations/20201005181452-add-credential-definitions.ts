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
  return db.createTable('credential_definitions', {
    credential_definition_id: {type: 'text', primaryKey: true, unique: true},
    tag: 'text',
    schema_id: 'text',
    type: 'text',
    protocol: 'text',
    value: 'json',
  })
}

exports.down = function (db) {
  return db.dropTable('credential_definitions')
}

exports._meta = {
  version: 1,
}
