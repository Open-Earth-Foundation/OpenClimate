CREATE TABLE "Action" (
  "action_id" varchar(255),
  "actor_id" varchar(255),
  "action_type" varchar(255),
  "sector" varchar(255),
  "year" int,
  "description" varchar(255),
  "emissions_reductions" int,
  "percent_achieved" int,
  "datasource_id" varchar(255),
  "created" timestamp,
  "last_updated" timestamp,
  PRIMARY KEY ("action_id"),
  CONSTRAINT "FK_Action.actor_id"
    FOREIGN KEY ("actor_id")
      REFERENCES "Actor"("actor_id"),
);
