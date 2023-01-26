// methodology.ts -- ORM definition for Methodology table

import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

const init = require("./init.ts");
export const sequelize = init.connect();

export class Methodology extends Model<
  InferAttributes<Methodology>,
  InferCreationAttributes<Methodology>
> {
  declare methodology_id: string; /* Methodology identifier */
  declare name: string; /* Human-readable name */
  declare methodology_link: string; /* Link to documentation on methodology */
  declare created: CreationOptional<Date>;
  declare last_updated: CreationOptional<Date>;
}

Methodology.init(
  {
    methodology_id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    methodology_link: {
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
    modelName: "Methodology",
    tableName: "Methodology",
    timestamps: true,
    createdAt: "created",
    updatedAt: "last_updated",
  }
);
