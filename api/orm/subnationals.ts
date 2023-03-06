import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  Op,
} from "sequelize";
import { City } from "./cities";
import { Country } from "./countries";
import { DataProvider } from "./dataProviders";
import { Emissions } from "./emissions";
import { Methodology } from "./methodologies";
import { Tag } from "./tags";

const init = require("./init.ts");
const sequelize = init.connect();
const logger = require("../logger").child({ module: __filename });

export class Subnational extends Model<
  InferAttributes<Subnational>,
  InferCreationAttributes<Subnational>
> {
  declare subnational_id: CreationOptional<number>;
  declare subnational_name: string;
  declare entity_type: string;
  declare spacial_polygon: string;
  declare flag_icon: string;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

Subnational.init(
  {
    subnational_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      unique: true,
    },
    subnational_name: {
      type: DataTypes.STRING,
    },
    entity_type: {
      type: DataTypes.STRING,
    },
    spacial_polygon: {
      type: DataTypes.STRING,
    },
    flag_icon: {
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
    modelName: "Subnational",
    tableName: "subnationals",
    timestamps: false,
  }
);

// Subnationals associations

const Subnational_to_City = sequelize.define(
  "subnationals_to_cities",
  {
    subnational_id: DataTypes.INTEGER,
    city_id: DataTypes.INTEGER,
  },
  {
    timestamps: false,
  }
);

Subnational.belongsToMany(City, {
  through: Subnational_to_City,
  foreignKey: "subnational_id",
  otherKey: "city_id",
});

City.belongsToMany(Subnational, {
  through: Subnational_to_City,
  foreignKey: "subnational_id",
  otherKey: "city_id",
});

const Emission_to_Subnational = sequelize.define(
  "emissions_to_subnationals",
  {
    subnational_id: DataTypes.INTEGER,
    emission_id: DataTypes.INTEGER,
  },
  {
    timestamps: false,
  }
);

Subnational.belongsToMany(Emissions, {
  through: Emission_to_Subnational,
  foreignKey: "subnational_id",
  otherKey: "emission_id",
});

Emissions.belongsToMany(Subnational, {
  through: Emission_to_Subnational,
  foreignKey: "emission_id",
  otherKey: "subnational_id",
});

export const getAllSubnationalDataByID = async (subnational_id, year) => {
  try {
    const subnationals = await Subnational.findAll({
      where: {
        subnational_id,
      },
      include: [
        {
          model: Emissions,
          where: {
            year,
          },
          include: [
            {
              model: DataProvider,

              include: [
                {
                  model: Methodology,
                  include: [
                    {
                      model: Tag,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          model: City,
          include: [
            {
              model: Emissions,
              include: [
                {
                  model: DataProvider,

                  include: [
                    {
                      model: Methodology,
                      include: [
                        {
                          model: Tag,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });
    return subnationals;
  } catch (error) {
    logger.error("Subnational not found: ", error.message);
  }
};

export const getAllSubnationals = async () => {
  try {
    const subnationals = await Subnational.findAll();
    return subnationals;
  } catch (error) {
    logger.error("Country not found: ", error.message);
  }
};
