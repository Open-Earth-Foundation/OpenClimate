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
  const sql = 'DELETE FROM roles'
  db.runSql(sql, function (err) {
    if (err) return console.log(err)
  })

  return db.insert('roles', ['role_name'], ['admin']).then(
    function (result) {
      return db.insert('roles', ['role_name'], ['demo user'])
    },
    function (err) {
      if (err) return console.log(err)
    },
  )
  // return db.runSql("INSERT INTO roles (role_name) values ('admin')", function (err) {
  //   if (err) return console.log(err)
  // })
}

exports.down = function (db) {
  const sql = 'DELETE FROM roles'
  db.runSql(sql, function (err) {
    if (err) return console.log(err)
  })
  return null
}

exports._meta = {
  version: 1,
}
