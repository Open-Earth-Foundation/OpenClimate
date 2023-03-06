// @ts-nocheck
import { Router } from "express";
import Transfers from "../orm/transfers";

const router = Router();

router.post("/api/:orgId/transfer", async (req: any, res: any) => {
  try {
    const addedTransfer = await Transfers.createTransfer(
      req.params.orgId,
      req.body
    );
    res.status(200).json(addedTransfer);
    req.logger.debug("Transfer saved");
  } catch (err: any) {
    req.logger.error({ name: err.name, message: err.message });
  }
});

router.get("/api/:orgId/transfer/all", async (req: any, res: any) => {
  try {
    const allTransfersByOrg = await Transfers.readTransfersByOrgId(
      req.params.orgId
    );

    const transfers = [];
    allTransfersByOrg.forEach((t) => {
      transfers.push({
        id: t.id,
        organization_credential_id: req.params.orgId,
        ...t.data,
      });
    });

    res.json([...transfers]);
  } catch (err: any) {
    req.logger.error({ name: err.name, message: err.message });
  }
});

export default router;
