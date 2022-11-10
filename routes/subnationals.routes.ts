import { Router } from "express";
const router =  Router();

import { getAllSubnationalDataByID, getAllSubnationals } from "../orm/subnationals";

router.get('/api/subnationals/', async (req:any, res:any) => {
    try{
        const subnationals = await getAllSubnationals();
        res.status(200).json({
            success: true,
            count: subnationals.length,
            data: subnationals
        })
    }
    catch (err:any) {
        req.logger.error({name: err.name, message: err.message})
    }
});

router.get('/api/subnationals/:year/:id/', async (req:any, res:any) => {
    const id = req.params.id
    try{
        const year = req.params.year
        const subnational = await getAllSubnationalDataByID(id, year);
        res.status(200).json({
            success: true,
            count: subnational.length,
            data: subnational
        })
    }
    catch (err:any) {
        req.logger.error({name: err.name, message: err.message})
    }
});


export default router;