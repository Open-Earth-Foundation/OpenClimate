// targettag.ts -- ORM mapping layer for TargetTag table

import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { Target } from "./target";
import { Tag } from "./tag";

const init = require("./init.ts");
export const sequelize = init.connect();

export class TargetTag extends Model<
  InferAttributes<TargetTag>,
  InferCreationAttributes<TargetTag>
> {
  declare target_id: string;
  declare tag_id: string;
  declare created: CreationOptional<Date>;
  declare last_updated: CreationOptional<Date>;
}

TargetTag.init(
  {
    target_id: {
      type: DataTypes.STRING,
      primaryKey: true,
      references: {
        model: Target,
        key: "target_id",
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
    modelName: "TargetTag",
    tableName: "TargetTag",
    timestamps: true,
    createdAt: "created",
    updatedAt: "last_updated",
  }
);
