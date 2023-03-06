// datasourcetag.ts -- ORM mapping layer for DataSourceTag table

import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { DataSource } from "./datasource";
import { Tag } from "./tag";

const init = require("./init.ts");
export const sequelize = init.connect();

export class DataSourceTag extends Model<
  InferAttributes<DataSourceTag>,
  InferCreationAttributes<DataSourceTag>
> {
  declare datasource_id: string;
  declare tag_id: string;
  declare created: CreationOptional<Date>;
  declare last_updated: CreationOptional<Date>;
}

DataSourceTag.init(
  {
    datasource_id: {
      type: DataTypes.STRING,
      primaryKey: true,
      references: {
        model: DataSource,
        key: "datasource_id",
      },
    },
    tag_id: {
      type: DataTypes.STRING,
      primaryKey: true,
      references: {
        model: Tag,
        key: "tag_id",
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
    modelName: "DataSourceTag",
    tableName: "DataSourceTag",
    timestamps: true,
    createdAt: "created",
    updatedAt: "last_updated",
  }
);
