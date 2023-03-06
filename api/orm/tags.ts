import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  Op,
} from "sequelize";

const init = require("./init.ts");
const sequelize = init.connect();

export class Tag extends Model<
  InferAttributes<Tag>,
  InferCreationAttributes<Tag>
> {
  declare tag_id: CreationOptional<number>;
  declare tag_name: string;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

Tag.init(
  {
    tag_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      unique: true,
    },
    tag_name: {
      type: DataTypes.STRING,
    },
    created_at: {
      type: DataTypes.DATE,
    },
    updated_at: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    modelName: "Tag",
    tableName: "tags",
    timestamps: false,
  }
);
