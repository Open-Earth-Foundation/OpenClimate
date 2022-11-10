import { Router } from "express";
import { getAllCities, getCityDataById } from "../orm/cities";
import { getAllProviders } from "../orm/dataProviders";

const router =  Router();

// Get all Country data by id

router.get('/api/city', async (req:any, res:any) => {
    try{
        const cityData = await getAllCities();
        res.status(200).json({
            success: true,
            count: cityData.length,
            data: cityData
        })
    }
    catch (err:any) {
        req.logger.error({name: err.name, message: err.message})
    }
});

router.get('/api/city/:year/:cityid/', async (req:any, res:any) => {
    try{
        const city_id: any = req.params.cityid;
        const year = req.params.year
        const cityData = await getCityDataById(city_id, year)
        req.logger.debug(cityData);
        res.status(200).json({
            success: true,
            data: cityData,
        })
    }
    catch (err:any) {
        req.logger.error({name: err.name, message: err.message})
    }
});


export default router;