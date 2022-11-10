// territory.ts -- ORM mapping layer for Territory table

import {DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional, Op, Sequelize} from 'sequelize';
import { DataSource } from './datasource';

const init = require('./init.ts');
export const sequelize = init.connect();

export class Territory extends Model <InferAttributes<Territory>, InferCreationAttributes<Territory>> {
    declare actor_id: string; /* Actor this territory represents */
    declare area: number; /* Area in km^2 */
    declare lat: number; /* Latitude of centroid or major landmark times 10000; 407494 => latitude 40.7494 */
    declare lng: number; /* Longitude of centroid or major landmark times 10000; -739674 => longitude -73.9674 */
    declare admin_bound: string; /* Geojson of boundary */
    declare datasource_id: string;
    declare created: CreationOptional<Date>;
    declare last_updated: CreationOptional<Date>;
}

Territory.init({
    actor_id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    area: {
        type: DataTypes.INTEGER,
    },
    lat: {
        type: DataTypes.INTEGER,
    },
    lng: {
        type: DataTypes.INTEGER
    },
    admin_bound: {
        type: DataTypes.TEXT
    },
    datasource_id: {
        type: DataTypes.STRING,
        references: {
            model: DataSource,
            key: "datasource_id"
        }
    },
    created: {
        type: DataTypes.DATE,
    },
    last_updated: {
        type: DataTypes.DATE
    }
}, {
    sequelize,
    modelName: 'Territory',
    tableName: 'Territory',
    timestamps: true,
    createdAt: "created",
    updatedAt: "last_updated"
});
