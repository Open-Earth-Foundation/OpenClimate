import { Router } from "express";
import { Actor } from "../orm/actor";
import { fn, Op } from "sequelize";
import { DataSource } from "../orm/datasource";
import { EmissionsAgg } from "../orm/emissionsagg";
import { Target } from "../orm/target";
import { Population } from "../orm/population";
import { GDP } from "../orm/gdp";
import { Territory } from "../orm/territory";

const router = Router();
export default router;

const wrap = (func) => (req, res, next) =>
  func(req, res, next).catch((err) => next(err));

router.get(
  "/api/v1/coverage/stats",
  wrap(async (_req: any, res: any) => {
    // instead of querying a bunch of counts, group by type to get them all at once
    const groupedActorCounts = await Actor.findAll({
      group: ["type"],
      attributes: ["type", [fn("COUNT", "type"), "count"]],
    });

    // transform list of database responses to dictionary object
    const actorCounts = groupedActorCounts.reduce<Record<string, number>>((res, entry: Actor & { dataValues: { count: string } }) => {
      res[entry.dataValues.type] = Number(entry.dataValues.count);
      return res;
    }, {});

    const dataSourceCount = await DataSource.count();
    const emissionsRecordsCount = await EmissionsAgg.count();
    const targetRecordsCount = await Target.count();

    // sum up contextual records
    const populationRecordsCount = await Population.count();
    const gdpRecordsCount = await GDP.count();
    const territoryRecordsCount = await Territory.count();
    const organizationRecordsCount = actorCounts["organization"] || 0;
    const contextualRecordsCount = populationRecordsCount + gdpRecordsCount + territoryRecordsCount + organizationRecordsCount;

    const countriesWithEmissionsCount = await Actor.count({
      distinct: true,
      col: "actor_id",
      include: [{ model: EmissionsAgg, required: true }],
      where: { type: "country" },
    });
    const regionsWithEmissionsCount = await Actor.count({
      distinct: true,
      col: "actor_id",
      include: { model: EmissionsAgg, required: true },
      where: { type: { [Op.or]: ["adm1", "adm1"] } },
    });
    const citiesWithEmissionsCount = await Actor.count({
      distinct: true,
      col: "actor_id",
      include: { model: EmissionsAgg, required: true },
      where: { type: "city" },
    });

    const countriesWithTargetsCount = await Actor.count({
      distinct: true,
      col: "actor_id",
      include: { model: Target, required: true },
      where: { type: "country" },
    });
    const regionsWithTargetsCount = await Actor.count({
      distinct: true,
      col: "actor_id",
      include: { model: Target, required: true },
      where: { type: { [Op.or]: ["adm1", "adm1"] } },
    });
    const citiesWithTargetsCount = await Actor.count({
      distinct: true,
      col: "actor_id",
      include: { model: Target, required: true },
      where: { type: "city" },
    });

    res.status(200).json({
      "number_of_data_sources": dataSourceCount,
      "number_of_countries": actorCounts["country"] || 0,
      "number_of_regions": (actorCounts["adm1"] || 0) + (actorCounts["adm2"] || 0),
      "number_of_cities": actorCounts["city"] || 0,
      "number_of_companies": actorCounts["company"] || 0,
      "number_of_facilities": actorCounts["site"] || 0,
      "number_of_emissions_records": emissionsRecordsCount,
      "number_of_target_records": targetRecordsCount,
      "number_of_contextual_records": contextualRecordsCount,
      "number_of_countries_with_emissions": countriesWithEmissionsCount,
      "number_of_countries_with_targets": countriesWithTargetsCount,
      "number_of_regions_with_emissions": regionsWithEmissionsCount,
      "number_of_regions_with_targets": regionsWithTargetsCount,
      "number_of_cities_with_emissions": citiesWithEmissionsCount,
      "number_of_cities_with_targets": citiesWithTargetsCount,
    });
  }),
);

