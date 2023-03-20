/* use cases datasources are approved for,
 * such as calculating percent achieved
 */

CREATE TABLE "DataSourceQuality" (
  "datasource_id" varchar(255), /* Which data source */
  "score_type" varchar(255), /* probably */
  "score" REAL, /* quality score between 0 - 1 */
  "notes" TEXT, /* why score chosen for each field */
  "created" timestamp,
  "last_updated" timestamp,
  PRIMARY KEY ("datasource_id", "score_type"),
  CONSTRAINT "datasourcequality_datasource_datasource_id"
    FOREIGN KEY ("datasource_id")
      REFERENCES "DataSource"("datasource_id"),
);