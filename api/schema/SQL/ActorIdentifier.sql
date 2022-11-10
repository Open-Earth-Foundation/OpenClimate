CREATE TABLE "ActorIdentifier" (
  "actor_id" varchar(255),
  "identifier" varchar(255),
  "namespace" varchar(255),
  "datasource_id" varchar(255),
  "created" timestamp,
  "last_updated" timestamp,
  PRIMARY KEY ("identifier", "namespace"),
  CONSTRAINT "FK_ActorIdentfier.actor_id"
    FOREIGN KEY ("actor_id")
      REFERENCES "Actor"("actor_id"),
  CONSTRAINT "FK_ActorIdentfier.datasource_id"
    FOREIGN KEY ("datasource_id")
      REFERENCES "DataSource"("datasource_id")
);