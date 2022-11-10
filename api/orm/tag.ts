// tag.ts -- ORM mapping layer for Tag table

import {DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional} from 'sequelize';

const init = require('./init.ts');
export const sequelize = init.connect();

export class Tag extends Model <InferAttributes<Tag>, InferCreationAttributes<Tag>> {
    declare tag_id: string; /* short, human-readable tag, no punctuation */
    declare tag_name: string; /* Longer description */
    declare created: CreationOptional<Date>; /* Create datestamp */
    declare last_updated: CreationOptional<Date>;  /* Update datestamp */
}

Tag.init({
    tag_id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    tag_name: {
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
    modelName: 'Tag',
    tableName: 'Tag',
    timestamps: true,
    createdAt: 'created',
    updatedAt: 'last_updated'
})