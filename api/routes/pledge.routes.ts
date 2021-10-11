import {Router} from 'express';
import {getConnection} from "typeorm";
import PledgeEntity from '../entities/Pledge';

const router = Router()

router.post('/api/pledge', (req: any, res: any) => {
    try {
        const pledgeData: any = req.body;
        const pledge = {
            data: pledgeData
        }
       console.log(pledge);
        const schemaRepo = getConnection().getRepository(PledgeEntity);
        schemaRepo.save(pledge);
        
        res.status(200).json(pledgeData);
        console.log('Pledge saved');
    }
    catch(err:any) {
        console.log(err);
    }
})

router.get('/api/pledge/all', async (req: any, res: any) => {
    try {
        const schemaRepo = getConnection().getRepository(PledgeEntity);

        const allPledges = await schemaRepo.find();
        console.log(allPledges);

        res.json({
            ...allPledges
        });
        
    }
    catch(err:any) {
        console.log(err);
    }
})


export default router