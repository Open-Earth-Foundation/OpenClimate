import { Router } from "express";
import { Actor } from "../orm/actor";
import { Territory } from "../orm/territory";
import { Population } from "../orm/population";
import { GDP } from "../orm/gdp";
import { Target } from "../orm/target";
import { EmissionsAgg } from "../orm/emissionsagg";
import { DataSource } from "../orm/datasource";
import { DataSourceTag } from "../orm/datasourcetag";
import { EmissionsAggTag } from "../orm/emissionsaggtag";
import { Tag } from "../orm/tag";
import { ActorDataCoverage } from "../orm/actordatacoverage";
import { Initiative } from "../orm/initiative";

import { isHTTPError, NotFound } from "http-errors";

const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const wrap = (fn) => (req, res, next) =>
  fn(req, res, next).catch((err) => next(err));

const router = Router();

// Get actor details

router.get(
  "/api/v1/actor/:actor_id",
  wrap(async (req: any, res: any) => {
    const actor_id: string = req.params.actor_id;

    const actor = await Actor.findByPk(actor_id);

    if (!actor) {
      throw new NotFound(`No actor found with actor ID ${actor_id}`);
    }

    const [territory, emissions, population, gdp, targets] = await Promise.all([
      Territory.findByPk(actor_id),
      EmissionsAgg.findAll({
        where: { actor_id: actor_id },
        order: [["year", "desc"]],
      }),
      Population.findAll({
        where: { actor_id: actor_id },
        order: [["year", "desc"]],
      }),
      GDP.findAll({ where: { actor_id: actor_id }, order: [["year", "desc"]] }),
      Target.findAll({
        where: { actor_id: actor_id },
        order: [
          ["target_year", "asc"],
          ["baseline_year", "asc"],
          ["target_type", "asc"],
          ["target_value", "asc"],
          ["datasource_id", "asc"],
        ],
      }),
    ]);

    // Get unique datasources

    const unique = (v, i, a) => a.indexOf(v) == i;

    const dataSourceIDs = emissions
      .map((ea) => ea.datasource_id)
      .concat(population.map((p) => p.datasource_id))
      .concat(gdp.map((gdp) => gdp.datasource_id))
      .concat(territory ? [territory.datasource_id] : [])
      .filter(unique);

    // Get unique initiative IDs

    const initiative_ids = targets
      .filter((t) => t.initiative_id)
      .map((t) => t.initiative_id)
      .filter(unique);

    const [dataSources, dataSourceTags, emissionsAggTags, initiatives] =
      await Promise.all([
        DataSource.findAll({ where: { datasource_id: dataSourceIDs } }),
        DataSourceTag.findAll({ where: { datasource_id: dataSourceIDs } }),
        EmissionsAggTag.findAll({
          where: { emissions_id: emissions.map((e) => e.emissions_id) },
        }),
        Initiative.findAll({ where: { initiative_id: initiative_ids } }),
      ]);

    // Extract unique tag_ids

    const tagIDs = dataSourceTags
      .map((dst) => dst.tag_id)
      .filter(unique)
      .concat(emissionsAggTags.map((eat) => eat.tag_id).filter(unique));

    const tags = await Tag.findAll({
      where: { tag_id: tagIDs },
    });

    const emissionMap = {};
    const emissionSources = dataSources.filter(
      (ds) =>
        -1 !== emissions.findIndex((ea) => ea.datasource_id == ds.datasource_id)
    );

    emissionSources.forEach((ds) => {
      emissionMap[ds.datasource_id] = {
        datasource_id: ds.datasource_id,
        name: ds.name,
        publisher: ds.publisher,
        published: ds.published,
        URL: ds.URL,
        tags: dataSourceTags
          .filter((dst) => dst.datasource_id == ds.datasource_id)
          .map((dst) => tags.find((tag) => tag.tag_id == dst.tag_id)),
        data: [],
      };
    });

    for (let emission of emissions) {
      emissionMap[emission.datasource_id].data.push({
        emissions_id: emission.emissions_id,
        total_emissions: parseInt(String(emission.total_emissions), 10),
        year: emission.year,
        tags: emissionsAggTags
          .filter((eat) => eat.emissions_id == emission.emissions_id)
          .map((eat) => tags.find((tag) => tag.tag_id == eat.tag_id)),
      });
    }

    const datasource = (datasource_id: string) => {
      const ds = dataSources.find((ds) => ds.datasource_id == datasource_id);
      return ds
        ? {
            datasource_id: ds.datasource_id,
            name: ds.name,
            published: ds.published,
            URL: ds.URL,
          }
        : null;
    };

    const getBestSource = () => {
      // TODO: change this to pull dataSourceIds from dataSourceQuality table
      const sourcesHierarchy = [
        "UNFCCC:GHG_ANNEX1:2019-11-08",
        "UNFCCC:GHG_profiles_nonAnnexOne:2022-09-27",
        "UNFCCC:GHG_profiles_nonAnnexOne:2022-09-27",
        "ECCC:GHG_inventory:2022-04-13",
        "EPA:state_GHG_inventory:2022-08-31"
      ];

      for (let source of sourcesHierarchy) {
          if (emissionMap[source]) {
              return source;
          }
      }

      return null;
    };

    const calculatePercentAchieved = (emissions, baselineYear, percent, dataSourceId) => {
      const percentDecimal = percent / 100;
      if (emissions[dataSourceId]) {
        const baselineEmissions = emissions[dataSourceId].data.find(emission => emission.year === baselineYear)?.total_emissions;
        const currentEmissions = emissions[dataSourceId].data[0]?.total_emissions;
        return (baselineEmissions - currentEmissions) / (baselineEmissions * percentDecimal);
      };
      return null;
    };

    res.status(200).json({
      success: true,
      data: {
        actor_id: actor.actor_id,
        name: actor.name,
        type: actor.type,
        icon: actor.icon,
        is_part_of: actor.is_part_of,
        area: territory ? parseInt(String(territory.area)) : undefined,
        lat: territory ? territory.lat / 10000.0 : undefined,
        lng: territory ? territory.lng / 10000.0 : undefined,
        territory: territory
          ? {
              area: territory ? parseInt(String(territory.area)) : undefined,
              lat: territory ? territory.lat / 10000.0 : undefined,
              lng: territory ? territory.lng / 10000.0 : undefined,
              datasource: datasource(territory.datasource_id),
            }
          : null,
        emissions: emissionMap,
        population: population.map((pop) => {
          return {
            population: parseInt(String(pop.population), 10),
            year: pop.year,
            datasource_id: pop.datasource_id,
            datasource: datasource(pop.datasource_id),
          };
        }),
        gdp: gdp.map((g) => {
          return {
            gdp: parseInt(String(g.gdp), 10),
            year: g.year,
            datasource_id: g.datasource_id,
            datasource: datasource(g.datasource_id),
          };
        }),
        targets: targets.map((t) => {
          const i = t.initiative_id
            ? initiatives.find((i) => i.initiative_id == t.initiative_id)
            : null;
          return {
            target_id: t.target_id,
            target_type: t.target_type,
            baseline_year: t.baseline_year,
            baseline_value: t.baseline_value,
            target_year: t.target_year,
            target_value: t.target_value,
            target_unit: t.target_unit,
            datasource_id: t.datasource_id,
            percent_achieved: t.target_type === "Absolute emission reduction"
              ? calculatePercentAchieved(emissionMap, t.baseline_year, t.target_value, getBestSource())
                : undefined,
            initiative: i
              ? {
                  initiative_id: i.initiative_id,
                  name: i.name,
                  description: i.description,
                  URL: i.URL,
                }
              : undefined,
          };
        }),
      },
    });
  })
);

// Get all parts of the actor

router.get(
  "/api/v1/actor/:actor_id/parts",
  wrap(async (req: any, res: any) => {
    const actor_id: string = req.params.actor_id;

    const actor = await Actor.findByPk(actor_id);

    if (!actor) {
      throw new NotFound(`No actor found with actor ID ${actor_id}`);
    }

    let parts: Array<Actor> = [];

    const recursive = req.query.recursive
      ? req.query.recursive == "yes"
      : false;

    if (recursive) {
      let parents = [actor_id];

      while (parents.length > 0) {
        let allParts = await Actor.findAll({ where: { is_part_of: parents } });
        let matched;
        let unmatched;
        if (req.query.type) {
          matched = allParts.filter((actor) => actor.type == req.query.type);
          unmatched = allParts.filter((actor) => actor.type != req.query.type);
        } else {
          matched = unmatched = allParts;
        }
        parts = parts.concat(matched);
        parents = unmatched.map((actor) => actor.actor_id);
      }

      parts.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
    } else {
      const where = {
        is_part_of: actor_id,
      };

      if (req.query.type) {
        where["type"] = req.query.type;
      }

      parts = await Actor.findAll({
        where: where,
        order: [["name", "ASC"]],
      });
    }

    let actor_ids = parts.map((p) => p.actor_id);

    let coverage = await ActorDataCoverage.findAll({
      where: { actor_id: actor_ids },
    });

    res.status(200).json({
      success: true,
      data: parts.map((child) => {
        let pc = coverage.find((c) => c.actor_id === child.actor_id);
        return {
          actor_id: child.actor_id,
          name: child.name,
          type: child.type,
          has_data: pc ? pc.has_data : null,
          has_children: pc ? pc.has_children : null,
          children_have_data: pc ? pc.children_have_data : null,
        };
      }),
    });
  })
);

// Get all parts of the actor

router.get(
  "/api/v1/actor/:actor_id/path",
  wrap(async (req: any, res: any) => {
    const actor_id: string = req.params.actor_id;

    const path = await Actor.path(actor_id);

    if (path.length == 0) {
      throw new NotFound(`No actor found with actor ID ${actor_id}`);
    }

    res.status(200).json({
      success: true,
      data: path.map((actor) => {
        return {
          actor_id: actor.actor_id,
          name: actor.name,
          type: actor.type,
        };
      }),
    });
  })
);

// Get emissions of the actor

router.get(
  "/api/v1/actor/:actor_id/emissions",
  wrap(async (req: any, res: any) => {
    const actor_id: string = req.params.actor_id;

    const actor = await Actor.findByPk(actor_id);

    if (!actor) {
      throw new NotFound(`No actor found with actor ID ${actor_id}`);
    }

    const emissions = await EmissionsAgg.findAll({
      where: { actor_id: actor_id },
      order: [["year", "desc"]],
    });

    // Get unique datasources

    const unique = (v, i, a) => a.indexOf(v) == i;

    const dataSourceIDs = emissions
      .map((ea) => ea.datasource_id)
      .filter(unique);

    const [dataSources, dataSourceTags, emissionsAggTags] = await Promise.all([
      DataSource.findAll({ where: { datasource_id: dataSourceIDs } }),
      DataSourceTag.findAll({ where: { datasource_id: dataSourceIDs } }),
      EmissionsAggTag.findAll({
        where: { emissions_id: emissions.map((e) => e.emissions_id) },
      }),
    ]);

    // Extract unique tag_ids

    const tagIDs = dataSourceTags
      .map((dst) => dst.tag_id)
      .filter(unique)
      .concat(emissionsAggTags.map((eat) => eat.tag_id).filter(unique));

    const tags = await Tag.findAll({
      where: { tag_id: tagIDs },
    });

    const emissionMap = {};
    const emissionSources = dataSources.filter(
      (ds) =>
        -1 !== emissions.findIndex((ea) => ea.datasource_id == ds.datasource_id)
    );

    emissionSources.forEach((ds) => {
      emissionMap[ds.datasource_id] = {
        datasource_id: ds.datasource_id,
        name: ds.name,
        publisher: ds.publisher,
        published: ds.published,
        URL: ds.URL,
        tags: dataSourceTags
          .filter((dst) => dst.datasource_id == ds.datasource_id)
          .map((dst) => tags.find((tag) => tag.tag_id == dst.tag_id)),
        data: [],
      };
    });

    for (let emission of emissions) {
      emissionMap[emission.datasource_id].data.push({
        emissions_id: emission.emissions_id,
        total_emissions: parseInt(String(emission.total_emissions), 10),
        year: emission.year,
        tags: emissionsAggTags
          .filter((eat) => eat.emissions_id == emission.emissions_id)
          .map((eat) => tags.find((tag) => tag.tag_id == eat.tag_id)),
      });
    }

    res.status(200).json({
      success: true,
      data: emissionMap,
    });
  })
);

// Get all actor emissions agg and return downloadable json
// download/[actor-id]-emissions.json

router.get(
  "/api/v1/download/:actor_id-emissions.json",
  wrap(async (req: any, res: any) => {
    const actor_id: string = req.params.actor_id;

    const actor = await Actor.findByPk(actor_id);

    if (!actor) {
      throw new NotFound(`No actor found with actor ID ${actor_id}`);
    }

    const emissions = await EmissionsAgg.findAll({
      where: { actor_id: actor_id },
      order: [["year", "desc"]],
    });

    // Get unique datasources

    const unique = (v, i, a) => a.indexOf(v) == i;

    const dataSourceIDs = emissions
      .map((ea) => ea.datasource_id)
      .filter(unique);

    const [dataSources, dataSourceTags, emissionsAggTags] = await Promise.all([
      DataSource.findAll({ where: { datasource_id: dataSourceIDs } }),
      DataSourceTag.findAll({ where: { datasource_id: dataSourceIDs } }),
      EmissionsAggTag.findAll({
        where: { emissions_id: emissions.map((e) => e.emissions_id) },
      }),
    ]);

    // Extract unique tag_ids

    const tagIDs = dataSourceTags
      .map((dst) => dst.tag_id)
      .filter(unique)
      .concat(emissionsAggTags.map((eat) => eat.tag_id).filter(unique));

    const tags = await Tag.findAll({
      where: { tag_id: tagIDs },
    });

    const emissionMap = {};
    const emissionSources = dataSources.filter(
      (ds) =>
        -1 !== emissions.findIndex((ea) => ea.datasource_id == ds.datasource_id)
    );

    emissionSources.forEach((ds) => {
      emissionMap[ds.datasource_id] = {
        datasource_id: ds.datasource_id,
        name: ds.name,
        publisher: ds.publisher,
        published: ds.published,
        URL: ds.URL,
        tags: dataSourceTags
          .filter((dst) => dst.datasource_id == ds.datasource_id)
          .map((dst) => tags.find((tag) => tag.tag_id == dst.tag_id)),
        data: [],
      };
    });

    for (let emission of emissions) {
      emissionMap[emission.datasource_id].data.push({
        emissions_id: emission.emissions_id,
        total_emissions: parseInt(String(emission.total_emissions), 10),
        year: emission.year,
        tags: emissionsAggTags
          .filter((eat) => eat.emissions_id == emission.emissions_id)
          .map((eat) => tags.find((tag) => tag.tag_id == eat.tag_id)),
      });
    }

    res.attachment(`${actor_id}-emissions.json`).status(200).json(emissionMap);
  })
);

// Get all actor emissions agg and return downloadable csv
// download/[actor-id]-emissions.csv
router.get(
  "/api/v1/download/:actor_id-emissions.csv",
  wrap(async (req: any, res: any) => {
    const actor_id: string = req.params.actor_id;
    console.log(actor_id);

    const actor = await Actor.findByPk(actor_id);

    if (!actor) {
      throw new NotFound(`No actor found with actor ID ${actor_id}`);
    }

    const [emissions] = await Promise.all([
      EmissionsAgg.findAll({
        where: { actor_id: actor_id },
        order: [["year", "desc"]],
      }),
    ]);

    // Get unique datasources

    const unique = (v, i, a) => a.indexOf(v) == i;

    const dataSourceIDs = emissions
      .map((ea) => ea.datasource_id)
      .filter(unique);

    const [dataSources] = await Promise.all([
      DataSource.findAll({ where: { datasource_id: dataSourceIDs } }),

      EmissionsAggTag.findAll({
        where: { emissions_id: emissions.map((e) => e.emissions_id) },
      }),
    ]);

    const emissionMap = {};
    const emissionSources = dataSources.filter(
      (ds) =>
        -1 !== emissions.findIndex((ea) => ea.datasource_id == ds.datasource_id)
    );

    emissionSources.forEach((ds) => {
      emissionMap[ds.datasource_id] = {
        datasource_id: ds.datasource_id,
        name: ds.name,
        publisher: ds.publisher,
        published: ds.published,
        created: ds.created,
        last_updated: ds.last_updated,
        URL: ds.URL,
        data: [],
      };
    });

    const convertTimeStampToDateString = (tt: any) => {
      return new Date(tt).toLocaleDateString("en-Us");
    };

    for (let emission of emissions) {
      emissionMap[emission.datasource_id].data.push({
        actor_id: actor_id,
        datasource_id: emission.datasource_id,
        emissions_id: emission.emissions_id,
        total_emissions: parseInt(String(emission.total_emissions), 10),
        year: emission.year,
        created: convertTimeStampToDateString(
          emissionMap[emission.datasource_id].created
        ),
        last_updated: convertTimeStampToDateString(
          emissionMap[emission.datasource_id].last_updated
        ),
      });
    }

    // Define the headers for the CSV file

    const csvWriter = createCsvWriter({
      path: `${actor.actor_id}-emissions.csv`,
      headerIdDelimiter: ".",
      header: [
        { id: "emissions_id", title: "emissions_id" },
        { id: "actor_id", title: "actor_id" },
        { id: "datasource_id", title: "datasource_id" },
        { id: "total_emissions", title: "total_emissions" },
        { id: "year", title: "year" },
        { id: "created", title: "Created" },
        { id: "last_updated", title: "last_updated" },
      ],
    });

    // Prepare emissions data

    let emdata = [];
    for (const k in emissionMap) {
      emdata.push(...emissionMap[k].data);
    }

    // Write the data to the CSV file and send for download

    await csvWriter.writeRecords(emdata).then(() => {
      res.status(200).download(`${actor.actor_id}-emissions.csv`);
    });
  })
);

export default router;
