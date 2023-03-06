// gdp.ts -- ORM mapping layer for GDP table

import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  Op,
  Sequelize,
} from "sequelize";
import { DataSource } from "./datasource";
import { Actor } from "./actor";

const init = require("./init.ts");
export const sequelize = init.connect();

export class GDP extends Model<
  InferAttributes<GDP>,
  InferCreationAttributes<GDP>
> {
  declare actor_id: string;
  declare year: number;
  declare gdp: number;
  declare datasource_id: string;
  declare created: CreationOptional<Date>;
  declare last_updated: CreationOptional<Date>;
}

GDP.init(
  {
    actor_id: {
      type: DataTypes.STRING,
      primaryKey: true,
      references: {
        model: Actor,
        key: "actor_id",
      },
    },
    year: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    gdp: {
      type: DataTypes.INTEGER,
    },
    datasource_id: {
      type: DataTypes.STRING,
      references: {
        model: DataSource,
        key: "datasource_id",
      },
    },
    created: {
      type: DataTypes.DATE,
    },
    last_updated: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    modelName: "GDP",
    tableName: "GDP",
    timestamps: true,
    createdAt: "created",
    updatedAt: "last_updated",
  }
);
