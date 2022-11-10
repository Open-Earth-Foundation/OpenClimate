'use strict';

const { methodologies } = require("../seeders/new-methodologies.seeder");

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  const sql   = 'DELETE FROM methodologies';
  db.runSql(sql, function(err){
    if (err) return console.log(err)
  });
  const timestamp = new Date()
  const castedTimestamp = timestamp.toISOString()
  methodologies.map((m)=>(
    db.insert( 
        'methodologies',
        ['methodology_id','dataset_name', 'date_update', 'methodology_link','data_provider_id', 'created_at', 'updated_at'],
        [m.methodology_id ,m.dataset_name, m.date_updated, m.methodology_link, m.data_provider_id, castedTimestamp, castedTimestamp]
    )));
  return null;
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
