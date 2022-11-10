'use strict';

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

const GCOM_PROVIDER_ID = 4;

exports.up = function(db) {
  return db.runSql(
    'UPDATE dataproviders ' +
    'SET data_provider_name = ?, ' +
     'data_provider_link = ?, ' + 
     'updated_at = ? ' + 
     'where data_provider_id = ?',
    ["EU Covenant of Mayors for Climate & Energy", 
    "https://www.covenantofmayors.eu/", 
    (new Date()).toISOString(),
    GCOM_PROVIDER_ID]
  )
};

exports.down = function(db) {
  return db.runSql(
    'UPDATE dataproviders ' +
    'SET data_provider_name = ?, ' +
     'data_provider_link = ?, ' + 
     'updated_at = ? ' + 
     'where data_provider_id = ?',
    ["Global Covenant of Mayors", 
    "https://di.unfccc.int/time_series", 
    (new Date()).toISOString(),
    GCOM_PROVIDER_ID]
  )
};

exports._meta = {
  "version": 1
};
