import {Router} from 'express';
import {getConnection} from "typeorm";
import SiteEntity from '../entities/Site';

const router = Router()

router.post('/api/site', (req: any, res: any) => {
    try {
        const siteData: any = req.body;
        const site = {
            data: siteData
        }
       console.log(site);
        const siteRepo = getConnection().getRepository(SiteEntity);
        siteRepo.save(site);
        
        res.status(200).json(siteData);
        console.log('Site saved');
    }
    catch(err:any) {
        console.log(err);
    }
})

router.get('/api/site/all', async (req: any, res: any) => {
    try {
        const siteRepo = getConnection().getRepository(SiteEntity);

        const allSites = await siteRepo.find();
        console.log(allSites);

        res.json({
            ...allSites
        });
        
    }
    catch(err:any) {
        console.log(err);
    }
})


export default router