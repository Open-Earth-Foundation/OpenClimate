// emissionsaggtag.ts -- ORM mapping layer for EmissionsAggTag table

import {DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional} from 'sequelize';
import {EmissionsAgg} from './emissionsagg'
import {Tag} from './tag'

const init = require('./init.ts');
export const sequelize = init.connect();

export class EmissionsAggTag extends Model <InferAttributes<EmissionsAggTag>, InferCreationAttributes<EmissionsAggTag>> {
    declare emissions_id: string;
    declare tag_id: string;
    declare created: CreationOptional<Date>;
    declare last_updated: CreationOptional<Date>;
}

EmissionsAggTag.init({
    emissions_id: {
        type: DataTypes.STRING,
        primaryKey: true,
        references: {
            model: EmissionsAgg,
            key: "emissions_id"
        }
    },
    tag_id: {
        type: DataTypes.STRING,
        primaryKey: true,
        references: {
            model: Tag,
            key: "tag_id"
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
    modelName: 'EmissionsAggTag',
    tableName: 'EmissionsAggTag',
    timestamps: true,
    createdAt: 'created',
    updatedAt: 'last_updated'
})