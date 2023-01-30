// initiative.ts -- ORM mapping layer for Initiative table

import {DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional, Op, Sequelize} from 'sequelize';
import {DataSource} from './datasource'

const init = require('./init.ts');
export const sequelize = init.connect();

export class Initiative extends Model <InferAttributes<Initiative>, InferCreationAttributes<Initiative>> {
    declare initiative_id: string;
    declare name: string;
    declare description: string;
    declare URL: string;
    declare datasource_id: string;
    declare created: CreationOptional<Date>;
    declare last_updated: CreationOptional<Date>;
}

Initiative.init({
    initiative_id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING
    },
    description: {
        type: DataTypes.STRING
    },
    URL: {
        type: DataTypes.STRING
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
        type: DataTypes.DATE,
    },
},{
    sequelize,
    modelName: 'Initiative',
    tableName: 'Initiative',
    timestamps: true,
    createdAt: "created",
    updatedAt: "last_updated"
})
