/* A tag on a target.
 *
 * Use these for aspects of a target that might not be general for
 * different kinds of targets. For example, 'conditional' and 'unconditional'
 * NDC targets for the Paris Agreement aren't applicable for
 * targets at subnational or city level.
 */

CREATE TABLE "TargetTag" (
  "target_id" varchar(255), /* Which data source */
  "tag_id" varchar(255), /* What the tag is. */
  "created" timestamp,
  "last_updated" timestamp,
  PRIMARY KEY ("target_id", "tag_id"),
  CONSTRAINT "FK_TargetTag.target_id"
    FOREIGN KEY ("target_id")
    REFERENCES "Target"("target_id"),
  CONSTRAINT "FK_TargetTag.tag_id"
    FOREIGN KEY ("tag_id")
    REFERENCES "Tag"("tag_id")
);
