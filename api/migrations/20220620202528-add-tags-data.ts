'use strict';

const { tags } = require("../seeders/tags.seeder");

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
  const sql   = 'DELETE FROM tags';
  db.runSql(sql, function(err){
    if (err) return console.log(err)
  });
  const timestamp = new Date()
  const castedTimestamp = timestamp.toISOString()
  tags.map((m)=>(
    db.insert( 
        'tags',
        ['tag_id','tag_name', 'created_at', 'updated_at'],
        [m.tag_id , m.tag_name, castedTimestamp, castedTimestamp]
    )));
  return null;
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
