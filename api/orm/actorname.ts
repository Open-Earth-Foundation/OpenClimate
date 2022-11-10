// actorname.ts -- ORM definition for ActorName table

import {DataTypes,Model,InferAttributes,InferCreationAttributes,CreationOptional} from 'sequelize'
import { Actor } from './actor';
import { DataSource } from './datasource';

const init = require('./init.ts');
export const sequelize = init.connect();

export class ActorName extends Model<InferAttributes<ActorName>, InferCreationAttributes<ActorName>> {
    declare actor_id: string; /* Actor being named */
    declare name: string; /* The name itself! */
    declare language: string; /* 2- or 3-char language code; 'und' means undetermined */
    declare preferred: boolean; /* Best name for language? Should only be one. */
    declare datasource_id: string; /* Where the record came from */
    declare created: CreationOptional<Date>;
    declare last_updated: CreationOptional<Date>;
}

ActorName.init({
    actor_id: {
        type: DataTypes.STRING,
        primaryKey: true,
        references: {
            model: Actor,
            key: 'actor_id'
        }
    },
    name: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    language: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    preferred: {
        type: DataTypes.BOOLEAN
    },
    datasource_id: {
        type: DataTypes.STRING,
        references: {
            model: DataSource,
            key: 'datasource_id'
        }
    },
    created: { type: DataTypes.DATE },
    last_updated: { type: DataTypes.DATE }

}, {
    sequelize,
    modelName: 'ActorName',
    tableName: 'ActorName',
    timestamps: true,
    createdAt: "created",
    updatedAt: "last_updated"
});
