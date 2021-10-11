import {Router} from 'express';
import {getConnection} from "typeorm";
import ClimateActionEntity from '../entities/ClimateAction';

const router = Router()

router.post('/api/climate-action', (req: any, res: any) => {
    try {
        const climateActionData: any = req.body;
        const climateAction = {
            data: climateActionData
        }
        console.log(climateAction);
        const schemaRepo = getConnection().getRepository(ClimateActionEntity);
        schemaRepo.save(climateAction);
        
        res.status(200).json(climateActionData);
        console.log('Climate action saved');
    }
    catch(err:any) {
        console.log(err);
    }
})

router.get('/api/climate-action/all', async (req: any, res: any) => {
    try {
        const schemaRepo = getConnection().getRepository(ClimateActionEntity);

        const allClimateActions = await schemaRepo.find();
        console.log(allClimateActions);

        res.json({
            ...allClimateActions
        });
        
    }
    catch(err:any) {
        console.log(err);
    }
})


export default router