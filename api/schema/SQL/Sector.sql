CREATE TABLE "Sector" (
  "sector_id" varchar(255), /* Unique ID */
  "name" varchar(255), /* human-readable name; TODO: i18n */
  "namespace" varchar(255), /* Namespace or vocabulary for the sector */
  "datasource_id" varchar(255), /* Where the record came from */
  "created" timestamp,
  "last_updated" timestamp,
  PRIMARY KEY ("sector_id"),
  CONSTRAINT "FK_Sector.datasource_id"
    FOREIGN KEY ("datasource_id")
      REFERENCES "DataSource"("datasource_id")
);
