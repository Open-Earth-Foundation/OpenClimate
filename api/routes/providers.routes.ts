import { Router } from "express";
import { getAllProviders } from "../orm/dataProviders";
const router = Router();

router.get("/api/providers", async (req: any, res: any) => {
  try {
    const providers = await getAllProviders();
    res.status(200).json({
      success: true,
      count: providers.length,
      data: providers,
    });
  } catch (err: any) {
    req.logger.error({ name: err.name, message: err.message });
  }
});

export default router;
