CREATE TABLE "Population" (
  "actor_id" varchar(255), /* Actor ID of territory */
  "population" bigint, /* Population in units; 1000 => 1000 people */
  "year" int, /* Year of measurement, YYYY */
  "created" timestamp,
  "last_updated" timestamp,
  "datasource_id" varchar(255),
  PRIMARY KEY ("actor_id", "year")  /* One record per actor per year */
);