// actoridentifier.ts -- ORM definition for ActorIdentifier table

import {DataTypes,Model,InferAttributes,InferCreationAttributes,CreationOptional} from 'sequelize'
import { Actor } from './actor';
import { DataSource } from './datasource';

const init = require('./init.ts');
export const sequelize = init.connect();

export class ActorIdentifier extends Model<InferAttributes<ActorIdentifier>, InferCreationAttributes<ActorIdentifier>> {
    declare actor_id: string; /* Actor being identified */
    declare identifier: string; /* Identifier, unique within namespace */
    declare namespace: string; /* Namespace of identifier, like UNLOCODE, GCOM, etc. */
    declare datasource_id: string; /* Where the record came from */
    declare created: CreationOptional<Date>;
    declare last_updated: CreationOptional<Date>;
}

ActorIdentifier.init({
    actor_id: {
        type: DataTypes.STRING,
        references: {
            model: Actor,
            key: 'actor_id'
        }
    },
    identifier: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    namespace: {
        type: DataTypes.STRING,
        primaryKey: true
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
    modelName: 'ActorIdentifier',
    tableName: 'ActorIdentifier',
    timestamps: true,
    createdAt: "created",
    updatedAt: "last_updated"
});
