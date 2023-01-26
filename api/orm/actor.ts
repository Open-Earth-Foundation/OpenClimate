// actor.ts -- ORM definition for Actor table

import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { DataSource } from "./datasource";

const init = require("./init.ts");
export const sequelize = init.connect();

export class Actor extends Model<
  InferAttributes<Actor>,
  InferCreationAttributes<Actor>
> {
  declare actor_id: string; /* Unique identifier for the Actor; ISO-3166, UN/LOCODE, other */
  declare type: string; /* One of: planet, country, adm1, city, organization, site */
  declare name: string; /* Default; see ActorName for alternates and languages */
  declare icon: string; /* URI of a square, small avatar icon, like a flag or logo */
  declare hq: string;
  declare is_part_of: string; /* Where this actor is physically */
  declare is_owned_by: string; /* Only for sites, which company owns them */
  declare datasource_id: string; /* Where the record came from */
  declare created: CreationOptional<Date>;
  declare last_updated: CreationOptional<Date>;
}

Actor.init(
  {
    actor_id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    type: { type: DataTypes.STRING },
    name: { type: DataTypes.STRING },
    icon: { type: DataTypes.STRING },
    hq: { type: DataTypes.STRING },
    is_part_of: {
      type: DataTypes.STRING,
      references: {
        model: Actor,
        key: "actor_id",
      },
    },
    is_owned_by: {
      type: DataTypes.STRING,
      references: {
        model: Actor,
        key: "actor_id",
      },
    },
    datasource_id: {
      type: DataTypes.STRING,
      references: {
        model: DataSource,
        key: "datasource_id",
      },
    },
    created: { type: DataTypes.DATE },
    last_updated: { type: DataTypes.DATE },
  },
  {
    sequelize,
    modelName: "Actor",
    tableName: "Actor",
    timestamps: true,
    createdAt: "created",
    updatedAt: "last_updated",
  }
);
