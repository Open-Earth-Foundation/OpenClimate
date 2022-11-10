/* A tag on a datasource.
 *
 * This is supposed to be expandable information. Typical uses might be for
 * defining the methodology used for emissions measurement, or to say
 * what kind of data is in the data source (geo, population, emissions,
 * pledges), or to talk about the re-use requirements. It's a many-to-many
 * structure; many tags for one data source, and many data sources with the
 * same tag.
 */

CREATE TABLE "DataSourceTag" (
  "datasource_id" varchar(255), /* Which data source */
  "tag_id" varchar(255), /* What the tag is. */
  "created" timestamp,
  "last_updated" timestamp,
  PRIMARY KEY ("datasource_id", "tag_id"),
  CONSTRAINT "FK_DataSourceTag.datasource_id"
    FOREIGN KEY ("datasource_id")
      REFERENCES "DataSource"("datasource_id"),
    CONSTRAINT "FK_DataSourceTag.tag_id"
        FOREIGN KEY ("tag_id")
        REFERENCES "Tag"("tag_id")
);
