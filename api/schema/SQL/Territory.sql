CREATE TABLE "Territory" (
  "actor_id" varchar(255), /* Actor this territory represents */
  "area" bigint, /* Area in km^2 */
  "lat" int, /* Latitude of centroid or major landmark times 10000; 407494 => latitude 40.7494 */
  "lng" int, /* Longitude of centroid or major landmark times 10000; -739674 => longitude -73.9674 */
  "admin_bound" text, /* Geojson of boundary */
  "created" timestamp,
  "last_updated" timestamp,
  "datasource_id" varchar(255),
  PRIMARY KEY ("actor_id")
);
