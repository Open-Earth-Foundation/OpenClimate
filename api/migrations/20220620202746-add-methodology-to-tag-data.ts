'use strict';

const { methodologyToTag } = require("../seeders/methodology-tag.seeder");

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
  const sql   = 'DELETE FROM methodology_to_tags';
  db.runSql(sql, function(err){
    if (err) return console.log(err)
  });
  const timestamp = new Date()
  const castedTimestamp = timestamp.toISOString()
  methodologyToTag.map((m)=>(
    db.insert( 
        'methodology_to_tags',
        ['methodology_id','tag_id'],
        [m.methodology_id , m.tag_id]
    )));
  return null;
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
