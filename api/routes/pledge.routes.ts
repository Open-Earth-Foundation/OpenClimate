import {Router} from 'express';
import Pledges from '../orm/pledges';

const router = Router()

router.post('/api/:orgId/pledge', async (req: any, res: any) => {
    try {
        const pledgeData: any = req.body;
        // const pledge = {
        //     organizationId: req.params.orgId,
        //     data: pledgeData
        // }

        // const schemaRepo = getConnection().getRepository(PledgeEntity);
        // const addedPledge = await schemaRepo.save(pledge);
        const pledge = await Pledges.createPledge(req.params.orgId, pledgeData)
        // pledgeData.id = addedPledge.id;

        res.status(200).json(pledge);
        req.logger.debug('Pledge saved');
    }
    catch(err:any) {
        req.logger.error({name: err.name, message: err.message})
    }
})

router.get('/api/:orgId/pledge/all', async (req: any, res: any) => {
    try {
        // const schemaRepo = getConnection().getRepository(PledgeEntity);

        // const allPledgesByOrg = await schemaRepo.find({where: 
        //     { 'organizationId': req.params.orgId }
        // });
        const allPledgesByOrg = await Pledges.readPledgeByOrgId(req.params.orgId)
        // const pledges = [];
        // allPledgesByOrg.forEach(t => {
        //     pledges.push({
        //         id: t.id,
        //         organization_credential_id: req.params.orgId,
        //         ...t.data
        //     });
        // });

        res.json([...allPledgesByOrg]);
    }
    catch(err:any) {
        req.logger.error({name: err.name, message: err.message})
    }
})

export default router