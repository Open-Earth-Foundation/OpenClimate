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
  return db.createTable('connections_to_contacts', {
    connection_id: 'text',
    contact_id: 'int',
  })
}

exports.down = function (db) {
  return db.dropTable('connections_to_contacts')
}

exports._meta = {
  version: 1,
}
