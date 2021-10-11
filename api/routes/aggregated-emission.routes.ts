import {Router} from 'express';
import {getConnection} from "typeorm";
import AggregatedEmissionEntity from '../entities/AggregatedEmission';

const router = Router()

router.post('/api/aggregated-emission', async (req: any, res: any) => {
    try {
        const aggregatedEmissionData: any = req.body;
        const aggregatedEmission = {
            data: aggregatedEmissionData
        }
        console.log(aggregatedEmission);
        const repo = getConnection().getRepository(AggregatedEmissionEntity);

        const foundEmission = await repo.findOne({where: {facility_credential_id: {$eq: aggregatedEmission['facility_credential_id']}}});

        console.log(foundEmission);

        if(foundEmission)
        {
            repo.update(foundEmission, aggregatedEmissionData);
            console.log('Aggregated emission updated');
        }
        else
        {
            repo.save(aggregatedEmission);
            console.log('Aggregated emission saved');
        }
        
        res.status(200).json(aggregatedEmission);
    }
    catch(err:any) {
        console.log(err);
    }
})

export default router