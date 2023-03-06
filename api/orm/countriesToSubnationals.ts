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

class CountriesToSubnationals extends Model<
  InferAttributes<CountriesToSubnationals>,
  InferCreationAttributes<CountriesToSubnationals>
> {
  declare country_id: number;
  declare subnational_id: number;
  declare created_at: CreationOptional<Date>;
  // updatedAt can be undefined during creation
  declare updated_at: CreationOptional<Date>;
}

CountriesToSubnationals.init(
  {
    country_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "Country",
        key: "country_id",
      },
    },
    subnational_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "Subnational",
        key: "subnational_id",
      },
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
    modelName: "CountriesToSubnationals",
    tableName: "countries_to_subnationals",
  }
);
