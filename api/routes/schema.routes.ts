import {Router} from 'express';
import {getConnection} from "typeorm";
import SchemaEntity from '../entities/Schema';

const router = Router()

router.post('/api/schema', (req: any, res: any) => {
    try {
        const schema: SchemaEntity = req.body;
        
        const schemaRepo = getConnection().getRepository(SchemaEntity);
        schemaRepo.save(schema);
        
        console.log('Schema created');
    }
    catch(err:any) {
        console.log(err);
    }
})

router.get('/api/schema', async (req: any, res: any) => {
    try {
        const schemaCategory = req.query.category;
        const schemaType = req.query.type;
        console.log(schemaCategory, schemaType);
        const schemaRepo = getConnection().getRepository(SchemaEntity);
        const schema = await schemaRepo.findOne(({where: {credential_category: {$eq: schemaCategory}, type: {$eq: schemaType}}}));
        console.log(schema);
        res.json({
            ...schema
        });

    }
    catch(err:any) {
        console.log(err);
    }
})


router.get('/api/schemas', async (req: any, res: any) => {
    try {
        const schemaCategory = req.query.category;

        const schemaRepo = getConnection().getRepository(SchemaEntity);
        const schemas = await schemaRepo.find(({where: {category: {$eq: schemaCategory}}}));

        console.log(schemas);

        res.json({
            ...schemas
        });

    }
    catch(err:any) {
        console.log(err);
    }
})



export default router