CREATE TABLE "ActorName" (
  "actor_id" varchar(255),
  "name" varchar(255),
  "language" varchar(255),
  "preferred" boolean,
  "datasource_id" varchar(255),
  "created" timestamp,
  "last_updated" timestamp,
  PRIMARY KEY ("actor_id", "language", "name"),
  CONSTRAINT "FK_ActorName.actor_id"
    FOREIGN KEY ("actor_id")
      REFERENCES "Actor"("actor_id"),
  CONSTRAINT "FK_ActorName.datasource_id"
    FOREIGN KEY ("datasource_id")
      REFERENCES "DataSource"("datasource_id")
);