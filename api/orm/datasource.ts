// datasource.ts -- ORM mapping layer for DataSource table

import {DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional} from 'sequelize';
import {Publisher} from './publisher'

const init = require('./init.ts');
export const sequelize = init.connect();

export class DataSource extends Model <InferAttributes<DataSource>, InferCreationAttributes<DataSource>> {
    declare datasource_id: string;
    declare name: string;
    declare publisher: string;
    declare published: Date;
    declare URL: string;
    declare created: CreationOptional<Date>;
    declare last_updated: CreationOptional<Date>;
}

DataSource.init({
    datasource_id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
    },
    publisher: {
        type: DataTypes.STRING,
        references: {
            model: Publisher,
            key: 'id'
        }
    },
    published: {
        type: DataTypes.DATE,
    },
    URL: {
        type: DataTypes.STRING,
    },
    created: {
        type: DataTypes.DATE,
    },
    last_updated: {
        type: DataTypes.DATE,
    },
},{
    sequelize,
    modelName: 'DataSource',
    tableName: 'DataSource',
    timestamps: true,
    createdAt: 'created',
    updatedAt: 'last_updated'
})