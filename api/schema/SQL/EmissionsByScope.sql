CREATE TABLE "EmissionsByScope" (
  "emissions_id" varchar(255), /* What emissions this is aggregated to */
  "scope" int, /* 1, 2, or 3 */
  "emissions_value" bigint, /* metric tonnes of CO2 equivalent */
  "created" timestamp,
  "last_updated" timestamp,
  PRIMARY KEY ("emissions_id", "scope"),
  CONSTRAINT "FK_EmissionsByScope.emissions_id"
    FOREIGN KEY ("emissions_id")
      REFERENCES "EmissionsAgg"("emissions_id")
);
