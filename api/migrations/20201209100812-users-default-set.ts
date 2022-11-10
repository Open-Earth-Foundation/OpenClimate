'use strict'

const bcrypt = require('bcryptjs')

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

exports.up = async function (db) {
  // If there are users, we need to delete them anyway
  const sql = 'DELETE FROM users'
  db.runSql(sql, function (err) {
    if (err) return console.log(err)
  })

  const timestamp = new Date()
  const castedTimestamp = timestamp.toISOString()
  const hashedPassword = await bcrypt.hash('12#$qwER', 10)

  return db
    .insert(
      'users',
      ['email', 'password', 'first_name', 'last_name', 'created_at', 'updated_at'],
      [
        'admin@client.com',
        hashedPassword,
        'admin',
        'user',
        castedTimestamp,
        castedTimestamp,
      ],
    )
    .then(function (err) {
      if (err) return console.log(err)
    })
}

exports.down = function (db) {
  const sql = 'DELETE FROM users'
  db.runSql(sql, function (err) {
    if (err) return console.log(err)
  })
  return null
}

exports._meta = {
  version: 1,
}
