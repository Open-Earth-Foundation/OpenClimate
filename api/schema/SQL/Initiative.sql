CREATE TABLE "Initiative" (
    "initiative_id" varchar(255), /* unique identifier */
    "name" varchar(255), /* Name of the initiative */
    "description" text, /* Longer description of the initiative */
    "URL" varchar(255), /* URL for more info about the initiative */
    "datasource_id" varchar(255), /* Datasource for this initiative */
    "created" timestamp, /* When this record was created */
    "last_updated" timestamp, /* When this record was last updated */
    PRIMARY KEY ("initiative_id"),
    CONSTRAINT "FK_Initiative.datasource_id"
    FOREIGN KEY ("datasource_id")
      REFERENCES "DataSource"("datasource_id")
)