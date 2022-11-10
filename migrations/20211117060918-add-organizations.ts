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
  return (
    db.createTable('organizations', {
      organization_id: {type: 'int', primaryKey: true, unique: true, autoIncrement: true},
      name: 'text',
      category: 'text',
      type: 'text',
      country: 'text',
      jurisdiction: 'text',
      created_at: 'timestamptz',
      updated_at: 'timestamptz',
    })
    .then(function() {
      const timestamp = new Date()
      const castedTimestamp = timestamp.toISOString()

      return db.insert('organizations',
          ['name', 'category', 'type', 'country', 'jurisdiction', 'created_at'],
          [
            'OpenClimate',
            'N/A',
            'N/A',
            'N/A',
            'N/A',
            castedTimestamp,
          ],
        )
    })
    .then(function() {
      return db.addColumn('users', 'organization_id', {
        type: 'int',
        null: true,
      })
    })
    .then(function() {
      const sql = 'UPDATE users SET organization_id = 1 WHERE user_id = 1'
      return db.runSql(sql, function (err) {
        if (err) return console.log(err)
      })
    })
  )
}

exports.down = function (db) {
  return (
    db.dropTable('organizations')
    .then(function () {
      return db.removeColumn('users', 'organization_id')
    })
  )
}

exports._meta = {
  "version": 1
}
