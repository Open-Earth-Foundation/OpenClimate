/* A tag on an emissions row.
 *
 * It's probably only necessary if the tags on the emissions row are
 * different from those on the data source. For example, the methodology
 * for an emissions data source is self-reported, but for this row, it's
 * predicted with ML. Or whatever. Don't repeat them for every row from
 * a data source; just tag the data source.
 */

CREATE TABLE "EmissionsAggTag" (
  "emissions_id" varchar(255), /* Tagged emissions row */
  "tag_id" varchar(255), /* Tag */
  "created" timestamp,
  "last_updated" timestamp,
  PRIMARY KEY ("emissions_id", "tag_id"),
  CONSTRAINT "FK_EmissionsAggTag.emissions_id"
    FOREIGN KEY ("emissions_id")
      REFERENCES "EmissionsAgg"("emissions_id"),
  CONSTRAINT "FK_EmissionsAggTag.tag_id"
    FOREIGN KEY ("tag_id")
      REFERENCES "Tag"("tag_id")
);
