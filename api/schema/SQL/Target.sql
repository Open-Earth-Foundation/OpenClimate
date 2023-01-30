/* Represents a single target by an actor. */

CREATE TABLE "Target" (
  "target_id" varchar(255), /* Unique identifier for this target */
  "actor_id" varchar(255), /* Actor responsible for the target */
  "target_type" varchar(255),
  "baseline_year" int, /* Year of comparison, YYYY */
  "target_year" int, /* Year of completion, YYYY */
  "baseline_value" bigint, /* Value of comparison */
  "target_value" bigint, /* Value of target */
  "target_unit" varchar(255), /* Unit comparison; tonnes of CO2, percent, ? */
  "bau_value" int, /* ? */
  "is_net_zero" boolean, /* Will this get them to net zero? */
  "percent_achieved" int, /* ? */
  "URL" varchar(255), /* URL of a human-readable document on the target. */
  "summary" varchar(255), /* short summary in English of the target. */
  "datasource_id" varchar(255), /* Source of this data */
  "created" timestamp,
  "last_updated" timestamp,
  "initiative_id" varchar(255), /* ID of related initiative, if any */
  PRIMARY KEY ("target_id"),
  CONSTRAINT "FK_Target.actor_id"
    FOREIGN KEY ("actor_id")
      REFERENCES "Actor"("actor_id"),
  CONSTRAINT "FK_Target.datasource_id"
    FOREIGN KEY ("datasource_id")
      REFERENCES "DataSource"("datasource_id"),
  CONSTRAINT "FK_Target.initiative_id"
    FOREIGN KEY ("initiative_id")
      REFERENCES "Initiative"("initiative_id")
);
