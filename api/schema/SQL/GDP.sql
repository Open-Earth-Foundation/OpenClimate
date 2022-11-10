CREATE TABLE "GDP" (
  "actor_id" varchar(255), /* Actor ID for the territory */
  "gdp" bigint, /* GDP in US dollars */
  "year" int, /* Year of measurement, YYYY */
  "created" timestamp,
  "last_updated" timestamp,
  "datasource_id" varchar(255),
  PRIMARY KEY ("actor_id", "year") /* One record per actor per year */
);