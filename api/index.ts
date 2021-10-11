import express from "express";
import { createConnection } from "typeorm";
import UserEntity from './entities/User';
import userRoutes from './routes/user.routes';
import authRoutes from './routes/auth.routes';
import schemaRoutes from './routes/schema.routes';
import pledgeRoutes from './routes/pledge.routes';
import transferRoutes from './routes/transfer.routes';
import siteRoutes from './routes/site.routes';
import climateActionRoutes from './routes/climate-action.routes';
import aggregatedEmissionRoutes from './routes/aggregated-emission.routes';
import cors from 'cors';
import SchemaEntity from "./entities/Schema";
import PledgeEntity from "./entities/Pledge";
import TransferEntity from "./entities/Transfer";
import SiteEntity from "./entities/Site";
import AggregatedEmissionEntity from "./entities/AggregatedEmission";
import ClimateActionsEntity from "./entities/ClimateAction";



createConnection({
    type: "mongodb",
    host: "localhost",
    port: 27017,
    database: "OpenEarth",
    entities: [UserEntity, SchemaEntity, PledgeEntity, TransferEntity, SiteEntity, 
        ClimateActionsEntity, AggregatedEmissionEntity]
}).then(connection => {
    const app = express();

    const allowedOrigins = ['http://localhost:3000'];
    
    const options: cors.CorsOptions = {
      origin: allowedOrigins
    };
    
    app.use(cors(options)); 
    app.use(express.json());
    //app.use(auth);
    app.use(authRoutes);
    app.use(userRoutes);
    app.use(schemaRoutes);
    app.use(pledgeRoutes);
    app.use(transferRoutes);
    app.use(siteRoutes);
    app.use(climateActionRoutes);
    app.use(aggregatedEmissionRoutes);
    
    const port = process.env.PORT ?? 3001;
    app.listen(port, () => {
        console.log(`Server has been started on port ${port}`);
    });
    // here you can start to work with your entities
});
