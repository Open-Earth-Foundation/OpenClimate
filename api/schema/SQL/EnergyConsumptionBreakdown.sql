CREATE TABLE "EnergyConsumptionBreakdown" (
  "energy_id" varchar(255), /* Energy identifier <source>:<actor_id>:<year> */
  "actor_id" varchar(255), /* Actor identifier */
  "year" int, /* Year of measurement, YYYY */
  "energy_consumption" bigint, /* Energy consumption in megajoules (MJ) */
  "fuel_type" varchar(255), /* oil, natural gal, coal, nuclear, hydroelectric, renewable */
  "created" timestamp,
  "last_updated" timestamp,
  PRIMARY KEY ("energy_id", "fuel_type"),
  CONSTRAINT "FK_EnergyConsumptionBreakdown.energy_id"
    FOREIGN KEY ("energy_id")
      REFERENCES "EnergyConsumption"("energy_id"),
  CONSTRAINT "FK_EnergyConsumptionBreakdown.actor_id"
    FOREIGN KEY ("actor_id")
      REFERENCES "Actor"("actor_id"),
);
