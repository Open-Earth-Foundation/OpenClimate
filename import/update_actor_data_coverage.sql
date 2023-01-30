insert into "ActorDataCoverage" (actor_id, has_data, created_at, updated_at)
    SELECT actor_id,
    (0 < (select count(*) from "EmissionsAgg" where "EmissionsAgg".actor_id = "Actor".actor_id))
    OR (0 < (select count(*) from "Target" where "Target".actor_id = "Actor".actor_id))
    OR (0 < (select count(*) from "Territory" where "Territory".actor_id = "Actor".actor_id))
    as has_data,
    NOW() as created_at,
    NOW() as updated_at
    FROM "Actor"
ON CONFLICT (actor_id)
    DO UPDATE
        SET (has_data, updated_at) = (EXCLUDED.has_data, EXCLUDED.updated_at);
