import { Router } from "express";
const Proofs = require("../orm/proofs");

const router = Router();

router.post("/api/proof/:userID/:credID/add", async (req: any, res: any) => {
  try {
    req.logger.debug("Request body", req.body);
    const addedProof = await Proofs.createProof(
      req.params.userID,
      req.params.credID
    );
    res.status(200).json(addedProof);
  } catch (err: any) {
    req.logger.error({ name: err.name, message: err.message });
  }
});

router.get("/api/proof/:userID/:credID/get", async (req: any, res: any) => {
  try {
    req.logger.debug("Request body", req.body);
    const proof = await Proofs.readProofsByCredDef(
      req.params.userID,
      req.params.credID
    );
    res.status(200).json(proof);
  } catch (err: any) {
    req.logger.error({ name: err.name, message: err.message });
  }
});

export default router;
