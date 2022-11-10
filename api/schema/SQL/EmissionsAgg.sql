CREATE TABLE "EmissionsAgg" (
  "emissions_id" varchar(255), /* Unique identifier for this record */
  "actor_id" varchar(255), /* Responsible party for the emissions */
  "year" int, /* Year of emissions, YYYY */
  "total_emissions" bigint, /* Integer value of tonnes of CO2 equivalent */
  "methodology_id" varchar(255), /* Methodology used */
  "datasource_id" varchar(255), /* Source for the data */
  "created" timestamp,
  "last_updated" timestamp,
  PRIMARY KEY ("emissions_id"),
  CONSTRAINT "FK_EmissionsAgg.actor_id"
    FOREIGN KEY ("actor_id")
      REFERENCES "Actor"("actor_id"),
  CONSTRAINT "FK_EmissionsAgg.methodology_id"
    FOREIGN KEY ("methodology_id")
      REFERENCES "Methodology"("methodology_id"),
  CONSTRAINT "FK_EmissionsAgg.datasource_id"
    FOREIGN KEY ("datasource_id")
      REFERENCES "DataSource"("datasource_id")
);
