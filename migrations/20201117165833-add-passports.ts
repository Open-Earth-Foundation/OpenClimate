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
  return db.createTable('passports', {
    contact_id: {type: 'int', primaryKey: true, unique: true},
    passport_number: 'text',
    surname: 'text',
    given_names: 'text',
    sex: 'text',
    date_of_birth: 'text',
    place_of_birth: 'text',
    nationality: 'text',
    date_of_issue: 'text',
    date_of_expiration: 'text',
    type: 'text',
    code: 'text',
    authority: 'text',
    photo: 'blob',
    created_at: 'timestamptz',
    updated_at: 'timestamptz',
  })
}

exports.down = function (db) {
  return db.dropTable('passports')
}

exports._meta = {
  version: 1,
}
