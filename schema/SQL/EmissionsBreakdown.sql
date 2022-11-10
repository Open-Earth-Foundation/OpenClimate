CREATE TABLE "EmissionsBreakdown" (
  "emissions_id" varchar(255),
  "emissions_scope" varchar(255),
  "emissions_source" varchar(255),
  "sector" varchar(255),
  "ghgs_included" varchar(255),
  "activity_description" varchar(255),
  "activity_value" int,
  "activity_unit" varchar(255),
  "emissions_factor" int,
  "emissions_value" int,
  "reporting_boundary" varchar(255),
  "gwp_used" varchar(255),
  "created" timestamp,
  "last_updated" timestamp,
  PRIMARY KEY ("emissions_id")
);
