CREATE TABLE "InitiativePledge" (
  "initiative_id" varchar(255),
  "actor_id" varchar(255),
  "initiative_type" varchar(255),
  "initiative_name" varchar(255),
  "initiative_statement" varchar(255),
  "datasource_id" varchar(255),
  "created" timestamp,
  "last_updated" timestamp,
  PRIMARY KEY ("initiative_id")
);