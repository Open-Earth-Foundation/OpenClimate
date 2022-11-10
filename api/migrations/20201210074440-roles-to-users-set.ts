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
  // If there are roles, we need to delete them anyway
  const sql = 'DELETE FROM roles_to_users'
  db.runSql(sql, function (err) {
    if (err) return console.log(err)
  })

  return db
    .insert('roles_to_users', ['role_id', 'user_id'], [1, 1])
    .then(function (err) {
      if (err) return console.log(err)
    })
}

exports.down = function (db) {
  const sql = 'DELETE FROM roles_to_users'
  db.runSql(sql, function (err) {
    if (err) return console.log(err)
  })
  return null
}

exports._meta = {
  version: 1,
}
