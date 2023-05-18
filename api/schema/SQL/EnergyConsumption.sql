CREATE TABLE "EnergyConsumption" (
  "energy_id" varchar(255), /* Energy identifier <source>:<actor_id>:<year> */
  "actor_id" varchar(255), /* Actor ID for the territory */
  "year" int, /* Year of measurement, YYYY */
  "energy_consumption" bigint, /* Energy consumption in megajoules (MJ) */
  "created" timestamp,
  "last_updated" timestamp,
  "datasource_id" varchar(255),
  PRIMARY KEY ("energy_id"),
  CONSTRAINT "FK_EnergyConsumption.actor_id"
    FOREIGN KEY ("actor_id")
      REFERENCES "Actor"("actor_id"),
);