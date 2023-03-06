// population.ts -- ORM mapping layer for Population table

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

export class Population extends Model<
  InferAttributes<Population>,
  InferCreationAttributes<Population>
> {
  declare actor_id: string;
  declare year: number;
  declare population: number;
  declare datasource_id: string;
  declare created: CreationOptional<Date>;
  declare last_updated: CreationOptional<Date>;
}

Population.init(
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
    population: {
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
    modelName: "Population",
    tableName: "Population",
    timestamps: true,
    createdAt: "created",
    updatedAt: "last_updated",
  }
);
