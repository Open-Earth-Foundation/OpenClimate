import { Router } from "express";
import { Actor } from "../orm/actor";
import { fn } from "sequelize";
import { DataSource } from "../orm/datasource";
import { EmissionsAgg } from "../orm/emissionsagg";
import { Target } from "../orm/target";
import { Population } from "../orm/population";
import { GDP } from "../orm/gdp";
import { Territory } from "../orm/territory";

const router = Router();
export default router;

const wrap = (fn) => (req, res, next) =>
  fn(req, res, next).catch((err) => next(err));

router.get(
  "/api/v1/coverage/stats",
  wrap(async (req: any, res: any) => {
    // instead of querying a bunch of counts, group by type to get them all at once
    const groupedActorCounts = await Actor.findAll({
      group: ["type"],
      attributes: ["type", [fn("COUNT", "type"), "count"]],
    });

    // transform list of [key, value] tuples to object
    const actorCounts = groupedActorCounts.reduce<Record<string, number>>((res, entry) => {
      res[entry[0]] = entry[1];
      return res;
    }, {});

    const dataSourceCount = await DataSource.count();
    const emissionsRecordsCount = await EmissionsAgg.count();
    const targetRecordsCount = await Target.count();

    // sum up contextual records
    const populationRecordsCount = await Population.count();
    const gdpRecordsCount = await GDP.count();
    const territoryRecordsCount = await Territory.count();
    const organizationRecordsCount = groupedActorCounts["organization"]; // TODO use this or the Organization model? (can't import)
    const contextualRecordsCount = populationRecordsCount + gdpRecordsCount + territoryRecordsCount + organizationRecordsCount;

    res.status(200).json({
      "number_of_data_sources": dataSourceCount,
      "number_of_countries": actorCounts["country"],
      "number_of_regions": actorCounts["adm1"] + actorCounts["adm2"],
      "number_of_cities": actorCounts["city"],
      "number_of_companies": actorCounts["company"],
      "number_of_facilities": actorCounts["facility"],
      "number_of_emissions_records": emissionsRecordsCount,
      "number_of_target_records": targetRecordsCount,
      "number_of_contextual_records": contextualRecordsCount,
      "number_of_countries_with_emissions": 0, // TODO
      "number_of_countries_with_targets": 0, // TODO
      "number_of_regions_with_emissions": 0, // TODO
      "number_of_regions_with_targets": 0, // TODO
      "number_of_cities_with_emissions": 0, // TODO
      "number_of_cities_with_targets": 0, // TODO
    });
  }),
);

