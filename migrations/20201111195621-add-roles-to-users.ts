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
  return db.createTable('roles_to_users', {
    role_id: 'int',
    user_id: 'int',
  })
}

exports.down = function (db) {
  return db.dropTable('roles_to_users')
}

exports._meta = {
  version: 1,
}
