import {Router} from 'express';

const router = Router()

// router.post('/api/schema', (req: any, res: any) => {
//     try {
//         const schema: SchemaEntity = req.body;
        
//         const schemaRepo = getConnection().getRepository(SchemaEntity);
//         schemaRepo.save(schema);
        
//         req.logger.debug('Schema created');
//     }
//     catch(err:any) {
//         req.logger.error({name: err.name, message: err.message})
//     }
// })

// router.get('/api/schema', async (req: any, res: any) => {
//     try {
//         const schemaCategory = req.query.category;
//         const schemaType = req.query.type;

//         const schemaRepo = getConnection().getRepository(SchemaEntity);
//         const schema = await schemaRepo.findOne(({where: {credential_category: {$eq: schemaCategory}, type: {$eq: schemaType}}}));
//         res.json({
//             ...schema
//         });

//     }
//     catch(err:any) {
//         req.logger.error({name: err.name, message: err.message})
//     }
// })


// router.get('/api/schemas', async (req: any, res: any) => {
//     try {
//         const schemaCategory = req.query.category;

//         const schemaRepo = getConnection().getRepository(SchemaEntity);
//         const schemas = await schemaRepo.find(({where: {category: {$eq: schemaCategory}}}));

//         res.json({
//             ...schemas
//         });

//     }
//     catch(err:any) {
//         req.logger.error({name: err.name, message: err.message})
//     }
// })



export default router