import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  Op,
} from "sequelize";

const init = require("./init.ts");
let sequelize = init.connect();

class SubnationalToCity extends Model<
  InferAttributes<SubnationalToCity>,
  InferCreationAttributes<SubnationalToCity>
> {
  declare subnational_id: number;
  declare city_id: number;
}

SubnationalToCity.init(
  {
    subnational_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "Subnational",
        key: "subnational_id",
      },
    },
    city_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "City",
        key: "city_id",
      },
    },
  },
  {
    sequelize,
    modelName: "SubnationalToCity",
    tableName: "subnationals_to_cities",
  }
);
