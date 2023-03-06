import { Router } from "express";
import {
  getAllCountries,
  getAllCountriesEmissions,
  getCountryDataById,
} from "../orm/countries";

const router = Router();

// Get all Country Emissions data

router.get("/api/country/:year", async (req: any, res: any) => {
  try {
    const countryData = await getAllCountriesEmissions(req.params.year);
    res.status(200).json({
      success: true,
      count: countryData.length,
      data: countryData,
    });
  } catch (err: any) {
    req.logger.error({ name: err.name, message: err.message });
  }
});

router.get("/api/country/", async (req: any, res: any) => {
  try {
    const countryData = await getAllCountries();
    res.status(200).json({
      success: true,
      count: countryData.length,
      data: countryData,
    });
  } catch (err: any) {
    req.logger.error({ name: err.name, message: err.message });
  }
});

router.get("/api/country/:year/:countryid", async (req: any, res: any) => {
  try {
    const countryid: any = req.params.countryid;
    const year = req.params.year;
    const providerid = req.params.providerid;
    const countryData = await getCountryDataById(countryid, year);

    req.logger.debug(countryData);
    if (countryData) {
      res.status(200).json({
        success: true,
        data: countryData,
      });
    } else {
      res.status(404).json({
        success: false,
        message: `No country with id ${countryid}`,
      });
    }
  } catch (err: any) {
    req.logger.error({ name: err.name, message: err.message });
  }
});

export default router;
