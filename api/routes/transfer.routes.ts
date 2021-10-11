import {Router} from 'express';
import {getConnection} from "typeorm";
import TransferEntity from '../entities/Transfer';

const router = Router()

router.post('/api/transfer', (req: any, res: any) => {
    try {
        const transferData: any = req.body;
        const transfer = {
            data: transferData
        }
       console.log(transfer);
        const schemaRepo = getConnection().getRepository(TransferEntity);
        schemaRepo.save(transfer);
        
        res.status(200).json(transferData);
        console.log('Transfer saved');
    }
    catch(err:any) {
        console.log(err);
    }
})

router.get('/api/transfer/all', async (req: any, res: any) => {
    try {
        const schemaRepo = getConnection().getRepository(TransferEntity);

        const allTransfers = await schemaRepo.find();
        console.log(allTransfers);

        res.json({
            ...allTransfers
        });
        
    }
    catch(err:any) {
        console.log(err);
    }
})


export default router