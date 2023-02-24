import { Router } from "express";
import { Actor } from "../orm/actor";
import { ActorName } from "../orm/actorname";
import { ActorIdentifier } from "../orm/actoridentifier";
import { BadRequest } from "http-errors";
import { Op } from "sequelize";
import { getClient } from "../elasticsearch/elasticsearch";
import { ActorDataCoverage } from "../orm/actordatacoverage";

const wrap = (fn) => (req, res, next) =>
  fn(req, res, next).catch((err) => next(err));

const router = Router();

export default router;

// Search for actors. Note that this is hitting the
// SQL database right now. We should probably move this to
// a real search back end like ElasticSearch

router.get(
  "/api/v1/search/actor",
  wrap(async (req: any, res: any) => {
    const { q, namespace, identifier, name, language, ...rest } = req.query;

    const rk = Object.keys(rest);

    if (rk.length > 0) {
      throw new BadRequest(`Unexpected query parameter(s) ${rk.join(",")}`);
    }

    if (!q && !identifier && !name) {
      throw new BadRequest(`Need exactly one of q, identifier, name parameter`);
    }

    if ((q && identifier) || (q && name) || (name && identifier)) {
      throw new BadRequest(`Need exactly one of q, identifier, name parameter`);
    }

    if (namespace && !identifier) {
      throw new BadRequest(`Need an identifier to search by namespace`);
    }

    if (language && !name) {
      throw new BadRequest(`Need a language to search by name`);
    }

    if (q && q.length < 2) {
      throw new BadRequest(`Minimum of 2 characters for search`);
    }

    // First, narrow by identifier

    let actor_ids = [];

    if (identifier) {
      const where = { identifier: identifier };

      if (namespace) {
        where["namespace"] = namespace;
      }

      const byID = await ActorIdentifier.findAll({ where: where });

      actor_ids = byID.map((ai) => ai.actor_id);
    } else if (name) {
      const where = { name: name };

      if (language) {
        where["language"] = language;
      }

      const byName = await ActorName.findAll({ where: where });

      actor_ids = byName.map((an) => an.actor_id);
    } else if (q) {
      if (process.env.ELASTIC_SEARCH_ENABLED === "yes") {
        const client = getClient();
        const query = {
          query: {
            function_score: {
              query: {
                bool: {
                  should: [
                    { match: { name: { query: q, boost: 1.0 } } },
                    { match: { type: { query: "country", boost: 1.1 } } },
                    { match: { type: { query: "adm1", boost: 1.05 } } },
                    { match: { type: { query: "adm2", boost: 1.05 } } },
                    { match: { type: { query: "company", boost: 1.1 } } },
                  ],
                },
              },
              functions: [
                {
                  field_value_factor: {
                    field: "population",
                    factor: 0.0000001,
                    modifier: "log1p",
                    missing: 1,
                  },
                },
                {
                  script_score: {
                    script: {
                      source: "1",
                    },
                  },
                },
              ],
              boost_mode: "sum",
            },
          },
        };

        const ActorIDS = await client.search({
          index: process.env.ELASTIC_SEARCH_INDEX_NAME,
          body: query,
        });

        actor_ids = ActorIDS.hits.hits.map((res: any) => res._source.actor_id);
      } else {
        const [byNameQ, byIdQ] = await Promise.all([
          ActorName.findAll({ where: { name: { [Op.like]: `%${q}%` } } }),
          ActorIdentifier.findAll({
            where: { identifier: { [Op.like]: `%${q}%` } },
          }),
        ]);
        actor_ids = byNameQ
          .map((an) => an.actor_id)
          .concat(byIdQ.map((ai) => ai.actor_id))
          .filter((a, i, l) => l.indexOf(a) === i);
      }
    }

    if (actor_ids.length === 0) {
      res.status(200).json({
        success: true,
        data: [],
      });
    } else {
      const [actors, identifiers, names, coverage] = await Promise.all([
        Actor.findAll({ where: { actor_id: actor_ids } }),
        ActorIdentifier.findAll({ where: { actor_id: actor_ids } }),
        ActorName.findAll({ where: { actor_id: actor_ids } }),
        ActorDataCoverage.findAll({ where: { actor_id: actor_ids } }),
      ]);

      const paths = await Actor.paths(actor_ids);

      res.status(200).json({
        success: true,
        data: actors.map((actor) => {
          let pc = coverage.find((c) => c.actor_id === actor.actor_id);
          let path = paths.find(
            (p) => p && p.length > 0 && p[0].actor_id == actor.actor_id
          );
          return {
            actor_id: actor.actor_id,
            name: actor.name,
            type: actor.type,
            is_part_of: actor.is_part_of,
            datasource_id: actor.datasource_id,
            created: actor.created,
            last_updated: actor.last_updated,
            has_data: pc ? pc.has_data : null,
            has_children: pc ? pc.has_children : null,
            children_have_data: pc ? pc.children_have_data : null,
            root_path_geo: path.slice(1).map((ancestor) => {
              return {
                actor_id: ancestor.actor_id,
                name: ancestor.name,
                type: ancestor.type,
              };
            }),
            names: names
              .filter((n) => n.actor_id == actor.actor_id)
              .map((n) => {
                return {
                  name: n.name,
                  language: n.language,
                  preferred: n.preferred,
                  datasource_id: n.datasource_id,
                  created: n.created,
                  last_updated: n.last_updated,
                };
              }),
            identifiers: identifiers
              .filter((id) => id.actor_id == actor.actor_id)
              .map((id) => {
                return {
                  identifier: id.identifier,
                  namespace: id.namespace,
                  datasource_id: id.datasource_id,
                  created: id.created,
                  last_updated: id.last_updated,
                };
              }),
          };
        }),
      });
    }
  })
);
