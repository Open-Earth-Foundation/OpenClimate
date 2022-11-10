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
  return db.createTable('issue_credentials', {
    credential_exchange_id: {type: 'text', primaryKey: true, unique: true},
    credential_id: 'text',
    credential: 'json',
    raw_credential: 'json',
    revocation_id: 'text',

    connection_id: 'text',
    state: 'text',
    role: 'text',
    initiator: 'text',

    thread_id: 'text',
    parent_thread_id: 'text',

    schema_id: 'text',
    credential_definition_id: 'text',
    revoc_reg_id: 'text',

    credential_proposal_dict: 'json',
    credential_offer: 'json',
    credential_offer_dict: 'json',
    credential_request: 'json',
    credential_request_metadata: 'json',

    auto_issue: 'boolean',
    auto_offer: 'boolean',
    auto_remove: 'boolean',

    error_msg: 'text',
    trace: 'boolean',

    created_at: 'timestamptz',
    updated_at: 'timestamptz',
  })
}

exports.down = function (db) {
  return db.dropTable('issue_credentials')
}

exports._meta = {
  version: 1,
}
