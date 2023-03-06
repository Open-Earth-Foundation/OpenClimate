/* use cases datasources are approved for,
 * such as calculating percent achieved
 */

CREATE TABLE "DataSourceApproved" (
  "datasource_id" varchar(255), /* Which data source */
  "ghg_target_percent_achieved" REAL, /* quality score between 0 - 1 */
  "notes" TEXT, /* why score chosen for each field */
  "created" timestamp,
  "last_updated" timestamp,
  PRIMARY KEY ("datasource_id"),
  CONSTRAINT "FK_DataSourceApproved.datasource_id"
    FOREIGN KEY ("datasource_id")
      REFERENCES "DataSource"("datasource_id"),
);