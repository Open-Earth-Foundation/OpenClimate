// publisher.ts -- ORM mapping layer for Publisher table

import {DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional, Op, Sequelize} from 'sequelize';

const init = require('./init.ts');
export const sequelize = init.connect();

export class Publisher extends Model <InferAttributes<Publisher>, InferCreationAttributes<Publisher>> {
    declare id: string;
    declare name: string;
    declare URL: string;
    declare created: CreationOptional<Date>;
    declare last_updated: CreationOptional<Date>;
}

Publisher.init({
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
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
    modelName: 'Publisher',
    tableName: 'Publisher',
    timestamps: true,
    createdAt: "created",
    updatedAt: "last_updated"
})
