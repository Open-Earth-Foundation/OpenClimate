CREATE TABLE "DataSource" (
  "datasource_id" varchar(255),
  "name" varchar(255),
  "publisher" varchar(255),
  "published" timestamp,
  "URL" varchar(255),
  "created" timestamp,
  "last_updated" timestamp,
  "citation" varchar(511),
  PRIMARY KEY ("datasource_id"),
  CONSTRAINT "FK_DataSource.publisher"
    FOREIGN KEY ("publisher")
      REFERENCES "Publisher"("id")
);
