CREATE TABLE "Actor" (
  "actor_id" varchar(255), /* Unique identifier for the Actor; ISO-3166, UN/LOCODE, other */
  "type" varchar(255), /* One of: planet, country, adm1, city, organization, site */
  "name" varchar(255), /* Default; see ActorName for alternates and languages */
  "icon" varchar(255), /* URI of a square, small avatar icon, like a flag or logo */
  "hq" varchar(255),
  "is_part_of" varchar(255), /* Where this actor is physically */
  "is_owned_by" varchar(255), /* Only for sites, which company owns them */
  "datasource_id" varchar(255), /* Where the record came from */
  "created" timestamp,
  "last_updated" timestamp,
  PRIMARY KEY ("actor_id"),
  CONSTRAINT "FK_Actor.is_owned_by"
    FOREIGN KEY ("is_owned_by")
      REFERENCES "Actor"("actor_id"),
  CONSTRAINT "FK_Actor.is_part_of"
    FOREIGN KEY ("is_part_of")
      REFERENCES "Actor"("actor_id"),
  CONSTRAINT "FK_Actor.datasource_id"
    FOREIGN KEY ("datasource_id")
      REFERENCES "DataSource"("datasource_id")
);
