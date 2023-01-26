// @ts-nocheck
import { Router } from "express";
import Climactions from "../orm/climactions";

const router = Router();
interface IClimateAction {
  id: string;
  organization_id: number;
  data: any;
}

router.post("/api/:orgId/climate-action", async (req: any, res: any) => {
  try {
    const addedClimateAction = await Climactions.createClimaction(
      req.params.orgId,
      req.body
    );
    res.status(200).json(addedClimateAction);
    req.logger.debug("Climate action saved");
  } catch (err: any) {
    req.logger.error({ name: err.name, message: err.message });
  }
});

router.get("/api/:orgId/climate-action/all", async (req: any, res: any) => {
  try {
    // const schemaRepo = getConnection().getRepository(ClimateActionEntity);

    // const climateActions = await schemaRepo.find({where:
    //     { 'organizationId': req.params.orgId }
    // });

    const allClimateActionsByOrg = await Climactions.readClimactionsByOrgId(
      req.params.orgId
    );
    const climateActions = [];
    allClimateActionsByOrg.forEach((t) => {
      climateActions.push({
        id: t.id,
        organization_credential_id: req.params.orgId,
        ...t.data,
      });
    });

    res.json([...climateActions]);
  } catch (err: any) {
    req.logger.error({ name: err.name, message: err.message });
  }
});

router.get("/api/climate-action/:siteName", async (req: any, res: any) => {
  try {
    // const schemaRepo = getConnection().getRepository(ClimateActionEntity);

    // const climateActionsBySite = await schemaRepo.find({where:
    //     { 'data.facility_name': req.params.siteName }
    // });

    const climateActionsBySite =
      await Climactions.readClimactionsByFacilityName(
        req.params.siteName,
        req.params.orgId
      );
    const climateActions = [];
    climateActionsBySite.forEach((t) => {
      climateActions.push({
        id: t.id,
        organization_credential_id: req.params.orgId,
        ...t.data,
      });
    });

    res.json([...climateActions]);
  } catch (err: any) {
    req.logger.error({ name: err.name, message: err.message });
  }
});

export default router;
