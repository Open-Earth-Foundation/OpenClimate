// @ts-nocheck
import { Router } from "express";
import { AggrEmissions, readAggrEmissionsByOrgId } from "../orm/aggrEmissions";

// recommended wrapper for Express async handlers
// see https://expressjs.com/en/advanced/best-practice-performance.html#use-promises

const wrap =
  (fn) =>
  (...args) =>
    fn(...args).catch(args[2]);

const router = Router();

router.post(
  "/api/:orgId/aggregated-emission",
  wrap(async (req: any, res: any) => {
    const aggregatedEmissionData: any = req.body;
    const aggregatedEmission = {
      organizationId: req.params.orgId,
      data: aggregatedEmissionData,
    };
    // const repo = getConnection().getRepository(AggregatedEmissionEntity);

    const foundEmission = await AggrEmissions.findOne({
      where: { "data.facility_name": aggregatedEmissionData["facility_name"] },
    });

    let result: any = {};
    if (foundEmission) {
      const timestamp = Date.now();
      foundEmission.data = aggregatedEmissionData;
      result = await AggrEmissions.update(
        {
          data: foundEmission,
          updated_at: timestamp,
        },
        {
          where: {
            id: foundEmission.id,
          },
        }
      );
      req.logger.debug(`Aggregated emission updated id: ${result.id}`);
    } else {
      const timestamp = Date.now();
      result = await repo.create({
        organization_id: req.params.orgId,
        data: aggregatedEmission,
        created_at: timestamp,
        updated_at: timestamp,
      });
      req.logger.debug(`Aggregated emission saved id: ${result.id}`);
    }

    aggregatedEmissionData.id = result.id;

    res.status(200).json(aggregatedEmissionData);
  })
);

router.get(
  "/api/:orgId/aggregated-emission/all",
  wrap(async (req: any, res: any) => {
    req.logger.debug(req.params.orgId);
    const allAggregatedEmissionsByOrg = await readAggrEmissionsByOrgId(
      req.params.orgId
    );

    const aggregatedEmissions = [];
    allAggregatedEmissionsByOrg.forEach((t) => {
      aggregatedEmissions.push({
        id: t.id,
        organization_credential_id: req.params.orgId,
        ...t.data,
      });
    });

    req.logger.debug(aggregatedEmissions);

    res.json([...aggregatedEmissions]);
  })
);

router.get(
  "/api/aggregated-emission/all",
  wrap(async (req: any, res: any) => {
    const allAggregatedEmissionsByOrg = await AggrEmissions.findAll();

    const aggregatedEmissions = [];
    allAggregatedEmissionsByOrg.forEach((t) => {
      aggregatedEmissions.push({
        id: t.id,
        organization_credential_id: t.organizationId,
        ...t.data,
      });
    });

    req.logger.debug(aggregatedEmissions);

    res.json([...aggregatedEmissions]);
  })
);

export default router;
