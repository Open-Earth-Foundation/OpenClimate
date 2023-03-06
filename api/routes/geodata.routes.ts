// @ts-nocheck
import { Router } from "express";
// import {getConnection} from "typeorm";
// import TransferEntity from '../entities/Transfer';
import axios from "axios";
import { Geosubnationals } from "../orm/geoSubnationals";

const router = Router();

// recommended wrapper for Express async handlers
// see https://expressjs.com/en/advanced/best-practice-performance.html#use-promises

const wrap =
  (fn) =>
  (...args) =>
    fn(...args).catch(args[2]);

router.get(
  "/api/geodata/subnational/:countryCode/:subnationalName",
  wrap(async (req: any, res: any) => {
    const geoUrlResponse = await axios.get(
      `https://www.geoboundaries.org/api/current/gbOpen/${req.params.countryCode}/ADM1/`
    );

    const geoDataResponse = await axios.get(geoUrlResponse.data.gjDownloadURL);
    const features = geoDataResponse.data.features;
    const foundNode = features.filter(
      (ft) =>
        ft.properties.shapeName.toLowerCase() ==
        req.params.subnationalName.toLowerCase()
    );

    req.logger.debug(foundNode);

    if (foundNode && foundNode.length) {
      res.json(foundNode);
    } else res.json([]);
  })
);

router.get(
  "/api/geodata/country/:countryCode",
  wrap(async (req: any, res: any) => {
    const countryCode = req.params.countryCode;

    if (!countryCode) {
      res.json(400, {
        success: false,
        message: "3-letter ISO-3166-1 country code required",
      });
      return;
    }

    if (!countryCode.match(/[A-Z]{3}/)) {
      res.json(400, {
        success: false,
        message: "3-letter ISO-3166-1 country code required",
      });
      return;
    }

    let foundGeoData = await Geosubnationals.findAll({
      where: { countryCode: countryCode },
    });

    req.logger.debug(`Found geodata: `, foundGeoData);

    let geoData;
    if (foundGeoData.length) {
      geoData = foundGeoData[0].data;
    } else {
      const geoUrlResponse = await axios.get(
        `https://www.geoboundaries.org/api/current/gbOpen/${countryCode}/ADM1/`
      );
      const geoDataResponse = await axios.get(
        geoUrlResponse.data.simplifiedGeometryGeoJSON
      );
      geoData = geoDataResponse.data.features;

      const gsn = Geosubnationals.build({
        countryCode: req.params.countryCode,
        data: geoData,
      });

      await gsn.save();
    }

    req.logger.debug(`Loaded geodata: `, geoData);

    res.json({
      name: req.params.countryCode,
      geoData: geoData,
    });
  })
);

export default router;
