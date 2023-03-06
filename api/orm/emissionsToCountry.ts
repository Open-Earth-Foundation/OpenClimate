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

class EmissionToCountry extends Model<
  InferAttributes<EmissionToCountry>,
  InferCreationAttributes<EmissionToCountry>
> {
  declare country_id: number;
  declare emission_id: number;
}

EmissionToCountry.init(
  {
    country_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "Country",
        key: "country_id",
      },
    },
    emission_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "Emission",
        key: "emissions_id",
      },
    },
  },
  {
    sequelize,
    modelName: "EmissionToCountry",
    tableName: "emissions_to_country",
  }
);
