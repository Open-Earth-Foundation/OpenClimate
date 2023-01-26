// actordatacoverage.ts -- ORM definition for ActorDataCoverage table

import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { Actor } from "./actor";

const init = require("./init.ts");
export const sequelize = init.connect();

export class ActorDataCoverage extends Model<
  InferAttributes<ActorDataCoverage>,
  InferCreationAttributes<ActorDataCoverage>
> {
  declare actor_id: string; /* Actor being identified */
  declare has_data: boolean; /* is there data for this actor directly */
  declare has_children: boolean; /* are there children for this actor (is_part_of) */
  declare children_have_data: boolean; /* is there data for the actor's children; null if no children */
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

ActorDataCoverage.init(
  {
    actor_id: {
      type: DataTypes.STRING,
      references: {
        model: Actor,
        key: "actor_id",
      },
      primaryKey: true,
    },
    has_data: {
      type: DataTypes.BOOLEAN,
    },
    has_children: {
      type: DataTypes.BOOLEAN,
    },
    children_have_data: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    created_at: { type: DataTypes.DATE },
    updated_at: { type: DataTypes.DATE },
  },
  {
    sequelize,
    modelName: "ActorDataCoverage",
    tableName: "ActorDataCoverage",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);
