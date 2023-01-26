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

class EmissionToCity extends Model<
  InferAttributes<EmissionToCity>,
  InferCreationAttributes<EmissionToCity>
> {
  declare city_id: number;
  declare emission_id: number;
}

EmissionToCity.init(
  {
    city_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "City",
        key: "city_id",
      },
    },
    emission_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "Emissions",
        key: "emissions_id",
      },
    },
  },
  {
    sequelize,
    modelName: "EmissionToCity",
    tableName: "emissions_to_cities",
  }
);
