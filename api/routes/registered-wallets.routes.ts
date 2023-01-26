import { Router } from "express";
import {
  addWallet,
  readWalletByDid,
  readWallets,
  readWalletByUserId,
} from "../orm/registered_wallets";

const router = Router();

router.post("/api/wallet/:userID/add", async (req: any, res: any) => {
  try {
    const addedWallet = await addWallet(req.params.orgID, req.body);
    res.status(200).json(addedWallet);
    req.logger.debug("Wallet saved");
  } catch (err: any) {
    req.logger.error({ name: err.name, message: err.message });
  }
});

router.get("/api/:userID/wallets", async (req: any, res: any) => {
  try {
    const wallet = await readWalletByUserId(req.params.userID);
    res.status(200).json(wallet);
  } catch (err: any) {
    req.logger.error({ name: err.name, message: err.message });
  }
});

export default router;
