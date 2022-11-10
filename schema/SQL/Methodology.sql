CREATE TABLE "Methodology" (
  "methodology_id" varchar(255), /* Unique identifier for this methodology */
  "name" varchar(255), /* Name for the methodology */
  "methodology_link" varchar(255), /* Link for human-readable methodology documentation */
  "created" timestamp,
  "last_updated" timestamp,
  PRIMARY KEY ("methodology_id")
);
