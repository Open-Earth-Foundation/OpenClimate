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
  return db.createTable('images', {
    image_id: {type: 'int', primaryKey: true, autoIncrement: true},
    name: {type: 'text', null: true},
    type: {type: 'text', null: true},
    image: {type: 'blob', null: true},
  })
}

exports.down = function (db) {
  return db.dropTable('images')
}

exports._meta = {
  version: 1,
}
