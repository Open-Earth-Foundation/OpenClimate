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
  return db.createTable('held_credentials', {
    credential_id: {type: 'text', primaryKey: true, unique: true},
    schema_id: 'text',
    credential_definition_id: 'text',
    rev_reg: 'json',
    revoc_reg_id: 'text',
    witness: 'json',
    signature: 'json',
    signature_correctness_proof: 'json',
    values: 'json',
  })
}

exports.down = function (db) {
  return db.dropTable('held_credentials')
}

exports._meta = {
  version: 1,
}
