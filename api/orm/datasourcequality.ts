// datasourcequality.ts -- ORM mapping layer for DataSourceQuality table

import { float } from "@elastic/elasticsearch/lib/api/types";
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

  export class DataSourceQuality extends Model<
    InferAttributes<DataSourceQuality>,
    InferCreationAttributes<DataSourceQuality>
  > {
    declare datasource_id: string;
    declare score_type: string;
    declare score: float;
    declare notes: string;
    declare created: CreationOptional<Date>;
    declare last_updated: CreationOptional<Date>;
  }

  DataSourceQuality.init(
    {
      datasource_id: {
        type: DataTypes.STRING,
        primaryKey: true,
        references: {
          model: DataSource,
          key: "datasource_id",
        },
      },
      score_type: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      score: {
        type: DataTypes.FLOAT,
      },
      notes: {
        type: DataTypes.STRING,
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
      modelName: "DataSourceQuality",
      tableName: "DataSourceQuality",
      timestamps: true,
      createdAt: "created",
      updatedAt: "last_updated",
    }
  );
