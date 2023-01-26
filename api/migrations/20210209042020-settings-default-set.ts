"use strict";

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db) {
  // If there is a theme, we need to delete it anyway
  const sql = "DELETE FROM settings";
  db.runSql(sql, function (err) {
    if (err) return console.log(err);
  });

  return db
    .insert(
      "settings",
      ["key", "value"],
      [
        "theme",
        JSON.stringify({
          primary_color: "rgb(0, 117, 104)",
          secondary_color: "#6bbab3",
          neutral_color: "#808080",
          negative_color: "#e33636",
          warning_color: "#ff8c42",
          positive_color: "#4CB944",
          text_color: "#555",
          text_light: "#fff",
          border: "#e3e3e3",
          drop_shadow: "none",
          background_primary: "#fff",
          background_secondary: "#f5f5f5",
        }),
      ]
    )
    .then(function () {
      return db.insert(
        "settings",
        ["key", "value"],
        [
          "smtp",
          JSON.stringify({
            host: "",
            user: "",
            pass: "",
          }),
        ]
      );
    })
    .then(function () {
      return db.insert(
        "settings",
        ["key", "value"],
        [
          "organization",
          JSON.stringify({
            companyName: "OpenClimate",
          }),
        ]
      );
    });
};

exports.down = function (db) {
  const sql = "DELETE FROM settings";
  db.runSql(sql, function (err) {
    if (err) return console.log(err);
  });
  return null;
};

exports._meta = {
  version: 1,
};
