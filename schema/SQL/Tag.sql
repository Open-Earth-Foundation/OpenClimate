/* A tag for a record, so we can have some extra data about it.
 * These are joined to records by a many-to-many junction table.
 * See DataSourceTag or EmissionsAggTag for examples.
 * See https://en.wikipedia.org/wiki/Tag_(metadata) for how tags
 * can be used.
 *
 * Tags should be human-readable, lowercase ASCII,
 * as short as possible, and avoid spaces or punctuation except
 * underscores. For example,
 * to tag a geographic data source, use 'geo' as the tag. For
 * machine learning, add 'machine_learning' or 'ml'.
 */

CREATE TABLE "Tag" (
  "tag_id" varchar(255), /* human-readable, short, no spaces or punctuation, ID for the tag */
  "tag_name" varchar(255), /* Longer description of the tag */
  "created" timestamp,
  "last_updated" timestamp,
  PRIMARY KEY ("tag_id")
);
