import { Router } from "express";
import {
  createSite,
  readSitesByOrgId,
  readSites,
  findAllByCountry,
  findAllByCountryAndJur,
} from "../orm/sites";

const router = Router();

router.post("/api/:orgId/site", async (req: any, res: any) => {
  try {
    const addedSite = await createSite(req.params.orgId, req.body);
    res.status(200).json(addedSite);
    req.logger.debug("Site saved");
  } catch (err: any) {
    req.logger.error({ name: err.name, message: err.message });
  }
});

router.get("/api/:orgId/site/all", async (req: any, res: any) => {
  try {
    req.logger.debug(req.params.orgId);
    const allSitesByOrg = await readSitesByOrgId(req.params.orgId);
    const sites = [];
    allSitesByOrg.forEach((t) => {
      sites.push({
        id: t.id,
        organization_credential_id: req.params.orgId,
        ...t.data,
      });
    });
    res.json([...sites]);
  } catch (err: any) {
    req.logger.error({ name: err.name, message: err.message });
  }
});

router.get("/api/site/all", async (req: any, res: any) => {
  try {
    const allSites = await readSites();

    const sites = [];
    allSites.forEach((t) => {
      sites.push({
        id: t.id,
        organization_credential_id: t.organization_id,
        ...t.data,
      });
    });

    res.json([...sites]);
  } catch (err: any) {
    req.logger.error({ name: err.name, message: err.message });
  }
});

router.get("/api/site/byCountry/:countryName", async (req: any, res: any) => {
  try {
    // const siteRepo = getConnection().getRepository(SiteEntity);

    const allSitesByCountry = await findAllByCountry(req.params.countryName);
    const sites = [];
    allSitesByCountry.forEach((t) => {
      sites.push({
        id: t.id,
        organization_credential_id: req.params.orgId,
        ...t.data,
      });
    });

    res.json([...sites]);
  } catch (err: any) {
    req.logger.error({ name: err.name, message: err.message });
  }
});

router.get(
  "/api/site/byJurisdiction/:countryName/:jurisdiction",
  async (req: any, res: any) => {
    try {
      const allSitesByJurisdiction = await findAllByCountryAndJur(
        req.params.countryName,
        req.params.jurisdiction
      );
      const sites = [];
      allSitesByJurisdiction.forEach((t) => {
        sites.push({
          id: t.id,
          organization_id: t.organization_id,
          ...t.data,
        });
      });

      res.json([...sites]);
    } catch (err: any) {
      req.logger.error({ name: err.name, message: err.message });
    }
  }
);

export default router;
