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
  return db.createTable('connections', {
    connection_id: {type: 'text', primaryKey: true, unique: true},
    state: 'text',
    my_did: 'text',

    alias: 'text',
    request_id: 'text',
    invitation_key: 'text',
    invitation_mode: 'text',
    invitation_url: 'text',
    invitation: 'json',
    accept: 'text',
    initiator: 'text',

    their_role: 'text',
    their_did: 'text',
    their_label: 'text',

    routing_state: 'text',
    inbound_connection_id: 'text',

    error_msg: 'text',
    
    user_id: {type: 'text', null: true},
    business_wallet: 'boolean',

    created_at: 'timestamptz',
    updated_at: 'timestamptz',


  })
}

exports.down = function (db) {
  return db.dropTable('connections')
}

exports._meta = {
  version: 1,
}
