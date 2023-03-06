import { Router } from "express";
import {
  addTrustedDID,
  readTrustedDID,
  readTrustedDIDByOrgName,
  readTrustedDIDs,
  checkTrustedDID,
} from "../orm/trusted_registry";

const router = Router();

router.post("/api/:trustedDID/add", async (req: any, res: any) => {
  try {
    const addedDID = await addTrustedDID(
      req.params.trustedDID,
      req.body.organization_name
    );
    res.status(200).json(addedDID);
    req.logger.debug("DID saved");
  } catch (err: any) {
    req.logger.error({ name: err.name, message: err.message });
  }
});

router.post("/api/:trustedDID/check", async (req: any, res: any) => {
  try {
    const checkDID = await checkTrustedDID(req.params.trustedDID);
    res.status(200).json(checkDID);
    req.logger.debug("DID saved");
  } catch (err: any) {
    req.logger.error({ name: err.name, message: err.message });
  }
});

export default router;
