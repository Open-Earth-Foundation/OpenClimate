// emissionsagg.ts -- ORM mapping layer for EmissionsAgg table

import {DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional} from 'sequelize';
import {DataSource} from './datasource'
import {Methodology} from './methodology';
import {Actor} from './actor';

const init = require('./init.ts');
export const sequelize = init.connect();

export class EmissionsAgg extends Model <InferAttributes<EmissionsAgg>, InferCreationAttributes<EmissionsAgg>> {
    declare emissions_id: string; /* Unique identifier for this record */
    declare actor_id: string; /* Responsible party for the emissions */
    declare year: number; /* Year of emissions, YYYY */
    declare total_emissions: number; /* Integer value of tonnes of CO2 equivalent */
    declare methodology_id: string; /* Methodology used */
    declare datasource_id: string; /* Source for the data */
    declare created: CreationOptional<Date>;
    declare last_updated: CreationOptional<Date>;
}

EmissionsAgg.init({
    emissions_id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    actor_id: {
        type: DataTypes.STRING,
        references: {
            model: Actor,
            key: "actor_id"
        }
    },
    year: {
        type: DataTypes.INTEGER
    },
    total_emissions: {
        type: DataTypes.INTEGER,
        get() {
            const rawValue = this.getDataValue('total_emissions');
            return rawValue;
        }
    },
    methodology_id: {
        type: DataTypes.STRING,
        references: {
            model: Methodology,
            key: "methodology_id"
        }
    },
    datasource_id: {
        type: DataTypes.STRING,
        references: {
            model: DataSource,
            key: "datasource_id"
        }
    },
    created: {
        type: DataTypes.DATE
    },
    last_updated: {
        type: DataTypes.DATE
    }
}, {
    sequelize,
    modelName: 'EmissionsAgg',
    tableName: 'EmissionsAgg',
    timestamps: true,
    createdAt: "created",
    updatedAt: "last_updated"
})